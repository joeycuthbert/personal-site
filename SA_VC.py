def run_ls1(adj, cutoff, seed):
    #print("DEBUG: Starting run_ls1...")
    random.seed(seed)
    start_time = time.time()
    
    # Preprocessing, apply Degree-0 and Degree-1 rules to simplify the graph
    n = len(adj)
    fixed_in_cover = set() # Vertices that must be in the cover due to degree-1 rule
    active_adj = {u: set(neighbors) for u, neighbors in adj.items()} # Track active graph
    
    # Make changes until no degree-0 or degree-1 vertices remain
    changed = True
    while changed:
        changed = False
        nodes = list(active_adj.keys())
        for u in nodes:
            if u not in active_adj: continue
            deg = len(active_adj[u])
            if deg == 0:
                del active_adj[u] # Degree-0 Rule: remove isolated vertex
                changed = True
            elif deg == 1:
                # Degree-1 Rule: add the only neighbor to the cover and remove it and its edges
                neighbor = next(iter(active_adj[u]))
                fixed_in_cover.add(neighbor)
                # Remove neighbor and all incident edges
                for v in list(active_adj[neighbor]):
                    active_adj[v].remove(neighbor)
                del active_adj[neighbor]
                changed = True


    current_cover = set() 
    edges = [(u, v) for u in active_adj for v in active_adj[u] if u < v] # Unique edges in active graph
            
    uncovered_edges = set(edges) # track uncovered edges for quick access
    edge_weights = {e: 1 for e in edges} # initial weights for edge weighting scheme
    
    # dscore: Change in total uncovered weight if vertex is flipped
    # conf_change: Cycle prevention mechanism 
    dscore = {v: 0 for v in active_adj}
    conf_change = {v: 1 for v in active_adj}
    
    # Initial greedy cover
    while uncovered_edges:
        u, v = random.choice(list(uncovered_edges))
        # Pick higher degree endpoint
        pick = u if len(active_adj[u]) > len(active_adj[v]) else v
        current_cover.add(pick)
        # Update uncovered edges
        for neighbor in active_adj[pick]:
            edge = tuple(sorted((pick, neighbor)))
            if edge in uncovered_edges:
                uncovered_edges.remove(edge)

    # Initial Scores
    for v in active_adj: # iterate through active vertices 
        score = 0
        for neighbor in active_adj[v]: # iterate through active neighbors
            edge = tuple(sorted((v, neighbor)))
            if edge in uncovered_edges: score += edge_weights[edge] # dscore gain if we add v to cover
            elif v in current_cover and neighbor not in current_cover: score -= edge_weights[edge] # dscore loss if we remove v from cover
        dscore[v] = score

    best_cover = current_cover | fixed_in_cover # combine processed vertices with greedy 
    trace = [(time.time() - start_time, len(best_cover))]
    
    # SIMULATED ANNEALING 
    # Parameters
    initial_temp = 10.0 # higher initial temperatures encourages explorastion, but may require tuning based on graph size and structure
    alpha = 0.99  # Cooling rate, close to 1 for slow cooling
    temp = initial_temp
    stagnation_counter = 0 # Counts iterations without improvement to trigger adaptive cooling
    rho = 0.7  # Forgetting factor from NuMVC, controls how quickly we reduce historical edge weights to prevent bias 
    bms_size = 50 # sampling size for Best Move Selection balances efficiency and solution quality

    while (time.time() - start_time) < cutoff:
        # If valid cover found, try to find a smaller one
        if not uncovered_edges:
            if len(current_cover) + len(fixed_in_cover) < len(best_cover):
                best_cover = current_cover | fixed_in_cover
                trace.append((time.time() - start_time, len(best_cover)))
                stagnation_counter = 0
            
            if not current_cover:
                # We found a cover of size 0 in the active_adj, which means the fixed_in_cover is the best we can do
                break
            
            # Greedy Jump: Remove vertex with highest dscore (lowest loss) to search k-1
            u = max(current_cover, key=lambda x: dscore[x])
            # Flipping u (Removing from cover)
            current_cover.remove(u)
            conf_change[u] = 0
            for z in active_adj[u]:
                conf_change[z] = 1
                edge = tuple(sorted((u, z)))
                if z not in current_cover:
                    uncovered_edges.add(edge)
                    dscore[u] -= edge_weights[edge]
                    dscore[z] += edge_weights[edge]
            continue

        # 1: Probabilistic Removal
        # Pick candidates via BMS for efficiency
        candidates = random.sample(list(current_cover), min(len(current_cover), bms_size))
        u = max(candidates, key=lambda x: dscore[x]) # choose best among sampled candidates for removal (lowest loss)
        
        # Metropolis Criterion: delta_E = -dscore(u)
        exponent = dscore[u] / temp
        if exponent > 700: # avoid math range error for large exponent, treat as probability 1
            probability = 1.0
        else:
            probability = math.exp(exponent)

        if random.random() < probability: # accept move with this probability
            current_cover.remove(u)
            conf_change[u] = 0
            for z in active_adj[u]:
                conf_change[z] = 1
                edge = tuple(sorted((u, z)))
                if z not in current_cover:
                    uncovered_edges.add(edge)
                    dscore[u] -= edge_weights[edge]
                    dscore[z] += edge_weights[edge]

        # 2: Corrective Addition (NuMVC Heuristic)
        if uncovered_edges:
            e = random.choice(list(uncovered_edges))
            # Pick endpoint with CC=1 and highest dscore
            v = max(e, key=lambda x: (conf_change[x], dscore[x]))
            
            current_cover.add(v)
            conf_change[v] = 1 # NuMVC updates CC on add too
            for z in active_adj[v]:
                conf_change[z] = 1
                edge = tuple(sorted((v, z)))
                if z not in current_cover:
                    uncovered_edges.remove(edge)
                    dscore[v] += edge_weights[edge]
                    dscore[z] -= edge_weights[edge]

        # 4: Weighting, Forgetting & Adaptive Cooling 
        # Update weights for all currently uncovered edges
        for e in uncovered_edges:
            edge_weights[e] += 1
            dscore[e[0]] += 1
            dscore[e[1]] += 1
        
        # Forgetting prevent historical bias if average weight is high
        if sum(edge_weights.values()) / len(edge_weights) > 2.0:
            for e in edge_weights:
                old_w = edge_weights[e]
                edge_weights[e] = math.floor(old_w * rho)

            for v in dscore: dscore[v] = 0
                
        # Adaptive Cooling Schedule 
        if stagnation_counter > 50:
            temp = initial_temp  
            stagnation_counter = 0
        else:
            temp = max(temp * alpha, 0.01) 

    #print("DEBUG: Finished run_ls1.")
    return best_cover, trace