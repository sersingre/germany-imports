import pandas as pd

trade_2025 = pd.read_csv("data/trade-destatis-2025.csv", delimiter=";")
trade_2026 = pd.read_csv("data/trade-destatis-2026.csv", delimiter=";")
iso = pd.read_csv("data/german-iso.csv", delimiter=";")

merged_2025 = trade_2025.merge(iso, left_on="country_name", right_on="german_name", how="left")
merged_2026 = trade_2026.merge(iso, left_on="country_name", right_on="german_name", how="left")

# Any row with no ISO code is a name that didn't match
print(merged_2025[merged_2025["iso"].isna()]["country_name"])
print(merged_2026[merged_2026["iso"].isna()]["country_name"])

merged_2025.drop(columns="country_name").set_index("iso").to_json("data/trade-2025.json", index=True, indent=2, orient="index")
merged_2026.drop(columns="country_name").set_index("iso").to_json("data/trade-2026.json", index=True, indent=2, orient="index")