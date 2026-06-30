import pickle
from pathlib import Path
import numpy as np
import pandas as pd
import statsmodels.api as sm

def train():
    project_root = Path(__file__).resolve().parents[1]
    data_path = project_root / 'data' / 'processed' / 'df_match_features.csv'
    models_dir = project_root / 'models'
    
    print(f"Loading match data from {data_path}...")
    df = pd.read_csv(data_path)
    df['date'] = pd.to_datetime(df['date'])
    
    # Calculate cutoff date for last 4 years
    max_date = df['date'].max()
    cutoff_date = max_date - pd.DateOffset(years=4)
    print(f"Dataset date range: {df['date'].min().strftime('%Y-%m-%d')} to {max_date.strftime('%Y-%m-%d')}")
    print(f"Cutoff date for last 4 years: {cutoff_date.strftime('%Y-%m-%d')}")
    
    recent_mask = df['date'] >= cutoff_date
    rest_mask = df['date'] < cutoff_date
    
    N_recent = recent_mask.sum()
    N_rest = rest_mask.sum()
    N = len(df)
    
    print(f"Recent matches (last 4 years): {N_recent:,}")
    print(f"Rest of historical matches: {N_rest:,}")
    print(f"Total matches: {N:,}")
    
    # Calculate sample weights
    weights = np.zeros(N)
    weights[recent_mask] = (0.35 * N) / N_recent
    weights[rest_mask] = (0.65 * N) / N_rest
    
    print("Sample weights calculated:")
    print(f"  Recent match weight: {weights[recent_mask][0]:.4f} (Sum: {weights[recent_mask].sum():.1f})")
    print(f"  Older match weight: {weights[rest_mask][0]:.4f} (Sum: {weights[rest_mask].sum():.1f})")
    
    # Build design matrix
    # Production features: const, home_elo_pre, away_elo_pre, tournament_weight, neutral
    X = pd.DataFrame({
        'const': 1.0,
        'home_elo_pre': df['home_elo_pre'],
        'away_elo_pre': df['away_elo_pre'],
        'tournament_weight': df['tournament_weight'],
        'neutral': df['neutral'].astype(int)
    })
    
    y_home = df['home_score']
    y_away = df['away_score']
    
    print("Fitting Home Goals Model...")
    model_home = sm.GLM(y_home, X, family=sm.families.Poisson(), var_weights=weights).fit()
    
    print("Fitting Away Goals Model...")
    model_away = sm.GLM(y_away, X, family=sm.families.Poisson(), var_weights=weights).fit()
    
    print("\n=== HOME GOALS MODEL SUMMARY ===")
    print(model_home.summary())
    
    print("\n=== AWAY GOALS MODEL SUMMARY ===")
    print(model_away.summary())
    
    # Save the models
    models_dir.mkdir(exist_ok=True)
    home_path = models_dir / 'poisson_home.pkl'
    away_path = models_dir / 'poisson_away.pkl'
    features_path = models_dir / 'feature_columns.pkl'
    
    print(f"\nSaving models to {models_dir}...")
    with open(home_path, 'wb') as f:
        pickle.dump(model_home, f)
    with open(away_path, 'wb') as f:
        pickle.dump(model_away, f)
    with open(features_path, 'wb') as f:
        pickle.dump(X.columns.tolist(), f)
        
    print("Weighted model training and saving complete!")

if __name__ == '__main__':
    train()
