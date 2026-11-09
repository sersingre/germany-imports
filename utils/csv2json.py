import pandas as pd

trade_2025 = pd.read_csv("data/trade-destatis-2025.csv", delimiter=";")
trade_2026 = pd.read_csv("data/trade-destatis-2026.csv", delimiter=";")
trade_cat = pd.read_csv("data/trade-categories.csv", delimiter=";")
iso = pd.read_csv("data/german-iso.csv", delimiter=";")

merged_2025 = trade_2025.merge(iso, left_on="country_name", right_on="german_name", how="left")
merged_2026 = trade_2026.merge(iso, left_on="country_name", right_on="german_name", how="left")
merged_cat = trade_cat.merge(iso, left_on="country_name", right_on="german_name", how="left")

# Any row with no ISO code is a name that didn't match
print(merged_2025[merged_2025["iso"].isna()]["country_name"])
print(merged_2026[merged_2026["iso"].isna()]["country_name"])
print(merged_cat[merged_cat["iso"].isna()]["country_name"])

merged_cat = merged_cat.drop(columns="country_name").set_index("iso")

merged_cat["export"] = merged_cat["export"].str.split("|")
merged_cat["import"] = merged_cat["import"].str.split("|")

merged_2025.drop(columns="country_name").set_index("iso").to_json("data/trade-2025.json", index=True, indent=2, orient="index")
merged_2026.drop(columns="country_name").set_index("iso").to_json("data/trade-2026.json", index=True, indent=2, orient="index")
merged_cat.to_json("data/trade-categories.json", index=True, indent=2, orient="index")