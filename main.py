import argparse
import sys
from pathlib import Path
import pandas as pd
from src.tournament import simulate_tournament
from src.data_loader import load_datasets

def run_one_simulation():
    print("Initializing World Cup 2026 Simulation...")
    res = simulate_tournament()
    summary = res["summary"]
    knockout = res["knockout_results"]
    
    print("\n==============================================")
    print("*** WORLD CUP 2026 SIMULATION RESULTS ***")
    print("==============================================")
    print(f"CHAMPION:  {summary['winner']}")
    print(f"RUNNER-UP: {summary['runner_up']}")
    print("==============================================\n")
    
    for round_name in ["R32", "R16", "QF", "SF", "Final"]:
        print(f"--- {round_name} MATCHES ---")
        round_matches = knockout[knockout["round"] == round_name]
        for _, match in round_matches.iterrows():
            resolved = " (resolved via pen/extra-time)" if match["result_type"] == "draw_resolved" else ""
            print(f"  {match['home_team']} {match['home_goals']} - {match['away_goals']} {match['away_team']}{resolved} -> Winner: {match['winner']}")
        print()

def run_monte_carlo(n_simulations):
    print(f"Starting Monte Carlo Simulation with {n_simulations} runs...")
    data = load_datasets()
    df_groups = data["groups"]
    wc_teams = sorted(df_groups["nation"].unique())
    
    stage_counts = {
        team: {
            "r32_count": 0,
            "r16_count": 0,
            "qf_count": 0,
            "sf_count": 0,
            "final_count": 0,
            "winner_count": 0
        }
        for team in wc_teams
    }
    
    all_winners = []
    
    for i in range(n_simulations):
        tournament = simulate_tournament()
        summary = tournament["summary"]
        
        for team in summary["r32_teams"]:
            stage_counts[team]["r32_count"] += 1
        for team in summary["r16_teams"]:
            stage_counts[team]["r16_count"] += 1
        for team in summary["qf_teams"]:
            stage_counts[team]["qf_count"] += 1
        for team in summary["sf_teams"]:
            stage_counts[team]["sf_count"] += 1
        for team in summary["final_teams"]:
            stage_counts[team]["final_count"] += 1
            
        winner = summary["winner"]
        stage_counts[winner]["winner_count"] += 1
        all_winners.append(winner)
        
        if (i + 1) % max(1, n_simulations // 10) == 0 or (i + 1) == n_simulations:
            print(f"  Progress: {i + 1}/{n_simulations} simulations completed.")
            
    df_simulation_results = pd.DataFrame.from_dict(
        stage_counts,
        orient="index"
    ).reset_index().rename(columns={"index": "team"})
    
    probability_columns = {
        "r32_count": "r32_prob",
        "r16_count": "r16_prob",
        "qf_count": "qf_prob",
        "sf_count": "sf_prob",
        "final_count": "final_prob",
        "winner_count": "winner_prob"
    }
    
    for count_col, prob_col in probability_columns.items():
        df_simulation_results[prob_col] = df_simulation_results[count_col] / n_simulations
        
    df_simulation_results = df_simulation_results.sort_values(
        "winner_prob",
        ascending=False
    ).reset_index(drop=True)
    
    processed_dir = Path(__file__).resolve().parent / "data" / "processed"
    output_path = processed_dir / "wc2026_tournament_probabilities.csv"
    
    # Merge with original metadata columns to preserve them and avoid KeyError: 'fifa_rank'
    # The original metadata columns are: confederation, fifa_rank, rank_change, elo, form_score
    try:
        df_old_prob = pd.read_csv(output_path)
        df_metadata = df_old_prob[["team", "confederation", "fifa_rank", "rank_change", "elo", "form_score"]].drop_duplicates()
        df_simulation_results = df_simulation_results.merge(df_metadata, on="team", how="left")
    except Exception as e:
        print(f"Warning: Could not merge original metadata: {e}")
        
    # Save the output
    df_simulation_results.to_csv(output_path, index=False)
    
    print("\nMonte Carlo simulation complete!")
    print(f"Saved results to: {output_path}")
    print("\n--- TOP 10 WINNERS ---")
    for idx, row in df_simulation_results.head(10).iterrows():
        print(f"{idx+1:2d}. {row['team']:<18s} Winner Prob: {row['winner_prob']*100:>6.2f}% | Final: {row['final_prob']*100:>5.1f}% | SF: {row['sf_prob']*100:>5.1f}% | QF: {row['qf_prob']*100:>5.1f}% | R16: {row['r16_prob']*100:>5.1f}% | R32: {row['r32_prob']*100:>5.1f}%")

def main():
    parser = argparse.ArgumentParser(description="World Cup 2026 Predictor CLI")
    parser.add_argument("--run-one", action="store_true", help="Run a single tournament simulation and print outcomes")
    parser.add_argument("--monte-carlo", type=int, metavar="N", help="Run N Monte Carlo simulations and save results")
    args = parser.parse_args()
    
    if args.run_one:
        run_one_simulation()
    elif args.monte_carlo is not None:
        run_monte_carlo(args.monte_carlo)
    else:
        print("World Cup 2026 Simulation Tool")
        print("-------------------------------")
        print("To run a single live tournament simulation in terminal:")
        print("  python main.py --run-one")
        print("\nTo run a Monte Carlo simulation (e.g. 1000 runs) and update probabilities:")
        print("  python main.py --monte-carlo 1000")
        print("\nTo launch the interactive Streamlit Web App dashboard:")
        print("  streamlit run simulation_app.py")

if __name__ == "__main__":
    main()
