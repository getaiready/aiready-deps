// Import helpers from separate module
import { stabilizeNodes, seedRandomPositions } from './simulation-helpers';
import type {
  SimulationNode,
  SimulationLink,
  ForceSimulationOptions,
  UseForceSimulationReturn,
} from './simulation-types';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

/**
 * Hook for managing d3-force simulations
 * Automatically handles simulation lifecycle, tick updates, and cleanup
 *
 * @param initialNodes - Initial nodes for the simulation
 * @param initialLinks - Initial links for the simulation
 * @param options - Configuration options for the force simulation
 * @returns Simulation state and control functions
 *
 * @example
 * ```tsx
 * function NetworkGraph() {
 *   const nodes = [
 *     { id: 'node1', name: 'Node 1' },
 *     { id: 'node2', name: 'Node 2' },
 *     { id: 'node3', name: 'Node 3' },
 *   ];
 *
 *   const links = [
 *     { source: 'node1', target: 'node2' },
 *     { source: 'node2', target: 'node3' },
 *   ];
 *
 *   const { nodes: simulatedNodes, links: simulatedLinks, restart } = useForceSimulation(
 *     nodes,
 *     links,
 *     {
 *       width: 800,
 *       height: 600,
 *       chargeStrength: -500,
 *       linkDistance: 150,
 *     }
 *   );
 *
 *   return (
 *     <svg width={800} height={600}>
 *       {simulatedLinks.map((link, i) => (
 *         <line
 *           key={i}
 *           x1={(link.source as SimulationNode).x}
 *           y1={(link.source as SimulationNode).y}
 *           x2={(link.target as SimulationNode).x}
 *           y2={(link.target as SimulationNode).y}
 *           stroke="#999"
 *         />
 *       ))}
 *       {simulatedNodes.map((node) => (
 *         <circle
 *           key={node.id}
 *           cx={node.x}
 *           cy={node.y}
 *           r={10}
 *           fill="#69b3a2"
 *         />
 *       ))}
 *     </svg>
 *   );
 * }
 * ```
 */
export function useForceSimulation(
  initialNodes: SimulationNode[],
  initialLinks: SimulationLink[],
  options: ForceSimulationOptions
): UseForceSimulationReturn & { setForcesEnabled: (enabled: boolean) => void } {
  /**
   * Enable or disable the simulation forces (charge and link forces).
   * When disabled, nodes can still be dragged but won't be affected by forces.
   * @param enabled - When true, simulation forces are active; when false, forces are disabled
   */
  const {
    chargeStrength = -300,
    linkDistance = 100,
    linkStrength = 1,
    collisionStrength = 1,
    collisionRadius = 10,
    centerStrength = 0.1,
    width,
    height,
    alphaDecay = 0.0228,
    velocityDecay = 0.4,
    alphaTarget = 0,
    warmAlpha = 0.3,
    alphaMin = 0.01,
    onTick,
    // Optional throttle in milliseconds for tick updates (reduce React re-renders)
    // Lower values = smoother but more CPU; default ~30ms (~33fps)
    stabilizeOnStop = true,
    tickThrottleMs = 33,
    maxSimulationTimeMs = 3000,
  } = options;

  const [nodes, setNodes] = useState<SimulationNode[]>(initialNodes);
  const [links, setLinks] = useState<SimulationLink[]>(initialLinks);
  const [isRunning, setIsRunning] = useState(false);
  const [alpha, setAlpha] = useState(1);

  const simulationRef = useRef<d3.Simulation<
    SimulationNode,
    SimulationLink
  > | null>(null);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Create lightweight keys for nodes/links so we only recreate the simulation
  // when the actual identity/content of inputs change (not when parent passes
  // new array references on each render).
  const nodesKey = initialNodes.map((n) => n.id).join('|');
  const linksKey = (initialLinks || [])
    .map((l) => {
      const sourceId =
        typeof l.source === 'string'
          ? l.source
          : (l.source as SimulationNode)?.id;
      const targetId =
        typeof l.target === 'string'
          ? l.target
          : (l.target as SimulationNode)?.id;
      const linkType = (l as SimulationLink & { type?: string }).type || '';
      return `${sourceId}->${targetId}:${linkType}`;
    })
    .join('|');

  useEffect(() => {
    // Create a copy of nodes and links to avoid mutating the original data
    const nodesCopy = initialNodes.map((node) => ({ ...node }));
    const linksCopy = initialLinks.map((link) => ({ ...link }));

    // ALWAYS seed initial positions to ensure nodes don't stack at origin
    // This is critical for force-directed graphs to work properly
    try {
      // Always seed positions for all nodes when simulation is created
      // This ensures nodes start spread out even if they have coordinates
      nodesCopy.forEach((n, i) => {
        // Use deterministic but more widely spread positions based on index
        const angle = (i * 2 * Math.PI) / nodesCopy.length;
        // Larger seed radius to encourage an initial spread
        const radius = Math.min(width, height) * 0.45;
        n.x = width / 2 + radius * Math.cos(angle);
        n.y = height / 2 + radius * Math.sin(angle);
        // Add very small random velocity to avoid large initial motion
        n.vx = (Math.random() - 0.5) * 2;
        n.vy = (Math.random() - 0.5) * 2;
      });
    } catch (e) {
      console.warn('Failed to seed node positions, falling back to random:', e);
      // If error, fall back to random positions
      seedRandomPositions(nodesCopy, width, height);
    }

    // Create the simulation
    const simulation = d3.forceSimulation(
      nodesCopy as SimulationNode[]
    ) as d3.Simulation<SimulationNode, SimulationLink>;

    // Configure link force separately to avoid using generic type args on d3 helpers
    try {
      const linkForce = d3.forceLink(
        linksCopy as d3.SimulationLinkDatum<SimulationNode>[]
      ) as d3.ForceLink<SimulationNode, d3.SimulationLinkDatum<SimulationNode>>;
      linkForce
        .id((d: SimulationNode) => d.id)
        .distance((d: d3.SimulationLinkDatum<SimulationNode>) => {
          const link = d as SimulationLink & { distance?: number };
          return link && link.distance != null ? link.distance : linkDistance;
        })
        .strength(linkStrength);
      simulation.force(
        'link',
        linkForce as d3.Force<
          SimulationNode,
          d3.SimulationLinkDatum<SimulationNode>
        >
      );
    } catch (e) {
      console.warn('Failed to configure link force, using fallback:', e);
      // fallback: attach a plain link force
      try {
        simulation.force(
          'link',
          d3.forceLink(
            linksCopy as d3.SimulationLinkDatum<SimulationNode>[]
          ) as d3.Force<SimulationNode, d3.SimulationLinkDatum<SimulationNode>>
        );
      } catch (fallbackError) {
        console.warn('Fallback link force also failed:', fallbackError);
      }
    }
    try {
      simulation.force(
        'charge',
        d3.forceManyBody().strength(chargeStrength) as d3.Force<
          SimulationNode,
          d3.SimulationLinkDatum<SimulationNode>
        >
      );
      simulation.force(
        'center',
        d3
          .forceCenter(width / 2, height / 2)
          .strength(centerStrength) as d3.Force<
          SimulationNode,
          d3.SimulationLinkDatum<SimulationNode>
        >
      );
      const collide = d3
        .forceCollide()
        .radius((d: d3.SimulationNodeDatum) => {
          const node = d as SimulationNode;
          const nodeSize = node && node.size ? (node.size as number) : 10;
          return nodeSize + collisionRadius;
        })
        .strength(collisionStrength) as d3.Force<
        SimulationNode,
        d3.SimulationLinkDatum<SimulationNode>
      >;
      simulation.force('collision', collide);
      simulation.force(
        'x',
        d3
          .forceX(width / 2)
          .strength(Math.max(0.02, centerStrength * 0.5)) as d3.Force<
          SimulationNode,
          d3.SimulationLinkDatum<SimulationNode>
        >
      );
      simulation.force(
        'y',
        d3
          .forceY(height / 2)
          .strength(Math.max(0.02, centerStrength * 0.5)) as d3.Force<
          SimulationNode,
          d3.SimulationLinkDatum<SimulationNode>
        >
      );
      simulation.alphaDecay(alphaDecay);
      simulation.velocityDecay(velocityDecay);
      simulation.alphaMin(alphaMin);
      try {
        simulation.alphaTarget(alphaTarget);
      } catch (e) {
        console.warn('Failed to set alpha target:', e);
      }
      try {
        simulation.alpha(warmAlpha);
      } catch (e) {
        console.warn('Failed to set initial alpha:', e);
      }
    } catch (e) {
      console.warn('Failed to configure simulation forces:', e);
      // ignore force configuration errors
    }

    simulationRef.current = simulation;

    // Force-stop timeout to ensure simulation doesn't run forever.
    if (stopTimeoutRef.current != null) {
      try {
        globalThis.clearTimeout(stopTimeoutRef.current);
      } catch (e) {
        console.warn('Failed to clear simulation timeout:', e);
      }
      stopTimeoutRef.current = null;
    }
    if (maxSimulationTimeMs && maxSimulationTimeMs > 0) {
      stopTimeoutRef.current = globalThis.setTimeout(() => {
        try {
          if (stabilizeOnStop) {
            stabilizeNodes(nodesCopy);
          }
          simulation.alpha(0);
          simulation.stop();
        } catch (e) {
          console.warn('Failed to stop simulation:', e);
        }
        setIsRunning(false);
        setNodes([...nodesCopy]);
        setLinks([...linksCopy]);
      }, maxSimulationTimeMs);
    }

    // Update state on each tick. Batch updates via requestAnimationFrame to avoid
    // excessive React re-renders which can cause visual flicker.
    let rafId: number | null = null;
    let lastUpdate = 0;
    const tickHandler = () => {
      try {
        if (typeof onTick === 'function')
          onTick(nodesCopy, linksCopy, simulation);
      } catch (e) {
        console.warn('Tick callback error:', e);
      }

      // If simulation alpha has cooled below the configured minimum, stop it to
      // ensure nodes don't drift indefinitely (acts as a hard-stop safeguard).
      try {
        if (simulation.alpha() <= alphaMin) {
          try {
            if (stabilizeOnStop) {
              stabilizeNodes(nodesCopy);
            }
            simulation.stop();
          } catch (e) {
            console.warn('Failed to stop simulation:', e);
          }
          setAlpha(simulation.alpha());
          setIsRunning(false);
          setNodes([...nodesCopy]);
          setLinks([...linksCopy]);
          return;
        }
      } catch (e) {
        console.warn('Error checking simulation alpha:', e);
      }

      const now = Date.now();
      const shouldUpdate = now - lastUpdate >= tickThrottleMs;
      if (rafId == null && shouldUpdate) {
        rafId = (
          globalThis.requestAnimationFrame ||
          ((cb: FrameRequestCallback) => setTimeout(cb, 16))
        )(() => {
          rafId = null;
          lastUpdate = Date.now();
          setNodes([...nodesCopy]);
          setLinks([...linksCopy]);
          setAlpha(simulation.alpha());
          setIsRunning(simulation.alpha() > simulation.alphaMin());
        });
      }
    };

    simulation.on('tick', tickHandler);

    simulation.on('end', () => {
      setIsRunning(false);
    });

    // Cleanup on unmount
    return () => {
      try {
        simulation.on('tick', null);
      } catch (e) {
        console.warn('Failed to clear simulation tick handler:', e);
      }
      if (stopTimeoutRef.current != null) {
        try {
          globalThis.clearTimeout(stopTimeoutRef.current);
        } catch (e) {
          console.warn('Failed to clear timeout on cleanup:', e);
        }
        stopTimeoutRef.current = null;
      }
      if (rafId != null) {
        try {
          (
            globalThis.cancelAnimationFrame ||
            ((id: number) => clearTimeout(id))
          )(rafId);
        } catch (e) {
          console.warn('Failed to cancel animation frame:', e);
        }
        rafId = null;
      }
      simulation.stop();
    };
  }, [
    nodesKey,
    linksKey,
    chargeStrength,
    linkDistance,
    linkStrength,
    collisionStrength,
    collisionRadius,
    centerStrength,
    width,
    height,
    alphaDecay,
    velocityDecay,
    alphaTarget,
    alphaMin,
    stabilizeOnStop,
    tickThrottleMs,
    maxSimulationTimeMs,
  ]);

  const restart = () => {
    if (simulationRef.current) {
      // Reheat the simulation to a modest alpha target rather than forcing
      // full heat; this matches the Observable pattern and helps stability.
      try {
        simulationRef.current.alphaTarget(warmAlpha).restart();
      } catch {
        simulationRef.current.restart();
      }
      setIsRunning(true);
      // Reset safety timeout when simulation is manually restarted
      if (stopTimeoutRef.current != null) {
        try {
          globalThis.clearTimeout(stopTimeoutRef.current);
        } catch (e) {
          console.warn('Failed to clear simulation timeout:', e);
        }
        stopTimeoutRef.current = null;
      }
      if (maxSimulationTimeMs && maxSimulationTimeMs > 0) {
        stopTimeoutRef.current = globalThis.setTimeout(() => {
          try {
            simulationRef.current?.alpha(0);
            simulationRef.current?.stop();
          } catch (e) {
            console.warn('Failed to stop simulation:', e);
          }
          setIsRunning(false);
        }, maxSimulationTimeMs);
      }
    }
  };

  const stop = () => {
    if (simulationRef.current) {
      simulationRef.current.stop();
      setIsRunning(false);
    }
  };

  const originalForcesRef = useRef({
    charge: chargeStrength,
    link: linkStrength,
    collision: collisionStrength,
  });
  const forcesEnabledRef = useRef(true);

  const setForcesEnabled = (enabled: boolean) => {
    const sim = simulationRef.current;
    if (!sim) return;
    // avoid repeated updates
    if (forcesEnabledRef.current === enabled) return;
    forcesEnabledRef.current = enabled;

    try {
      // Only toggle charge and link forces to avoid collapse; keep collision/centering
      const charge = sim.force(
        'charge'
      ) as d3.ForceManyBody<SimulationNode> | null;
      if (charge && typeof charge.strength === 'function') {
        charge.strength(enabled ? originalForcesRef.current.charge : 0);
      }

      const link = sim.force('link') as d3.ForceLink<
        SimulationNode,
        d3.SimulationLinkDatum<SimulationNode>
      > | null;
      if (link && typeof link.strength === 'function') {
        link.strength(enabled ? originalForcesRef.current.link : 0);
      }
    } catch (e) {
      console.warn('Failed to toggle simulation forces:', e);
    }
  };

  return {
    nodes,
    links,
    restart,
    stop,
    isRunning,
    alpha,
    setForcesEnabled,
  };
}

/**
 * Hook for creating a draggable force simulation
 * Provides drag handlers that can be attached to node elements
 *
 * @param simulation - The d3 force simulation instance
 * @returns Drag behavior that can be applied to nodes
 *
 * @example
 * ```tsx
 * function DraggableNetworkGraph() {
 *   const simulation = useRef<d3.Simulation<SimulationNode, SimulationLink>>();
 *   const drag = useDrag(simulation.current);
 *
 *   return (
 *     <svg>
 *       {nodes.map((node) => (
 *         <circle
 *           key={node.id}
 *           {...drag}
 *           cx={node.x}
 *           cy={node.y}
 *           r={10}
 *         />
 *       ))}
 *     </svg>
 *   );
 * }
 * ```
 */
export function useDrag(
  simulation: d3.Simulation<SimulationNode, any> | null | undefined
) {
  const dragStarted = (event: any, node: SimulationNode) => {
    if (!simulation) return;
    if (!event.active) simulation.alphaTarget(0.3).restart();
    node.fx = node.x;
    node.fy = node.y;
  };

  const dragged = (event: any, node: SimulationNode) => {
    node.fx = event.x;
    node.fy = event.y;
  };

  const dragEnded = (event: any, node: SimulationNode) => {
    if (!simulation) return;
    if (!event.active) simulation.alphaTarget(0);
    node.fx = null;
    node.fy = null;
  };

  return {
    onDragStart: dragStarted,
    onDrag: dragged,
    onDragEnd: dragEnded,
  };
}
