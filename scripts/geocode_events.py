# -*- coding: utf-8 -*-
"""
既存イベントの住所をジオコーディングして latitude/longitude を更新する。
国土地理院 GSI API を使用（無料・APIキー不要）。

使い方:
  py scripts/geocode_events.py
"""

import os
import time
import urllib.request
import urllib.parse
import json
from supabase import create_client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://pyylggxlwatsmphxglcu.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", os.environ.get("SUPABASE_KEY", ""))

GSI_GEOCODE_URL = "https://msearch.gsi.go.jp/address-search/AddressSearch"


def geocode_address(address: str) -> tuple[float, float] | None:
    """GSI API で住所から緯度経度を取得"""
    if not address:
        return None

    params = urllib.parse.urlencode({"q": address})
    url = f"{GSI_GEOCODE_URL}?{params}"

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "jotokai-web/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))

        if data and len(data) > 0:
            # GSI returns [lng, lat] in geometry.coordinates
            coords = data[0].get("geometry", {}).get("coordinates", [])
            if len(coords) == 2:
                lng, lat = coords
                return (float(lat), float(lng))
    except Exception as e:
        print(f"  Geocoding error for '{address}': {e}")

    return None


def main():
    if not SUPABASE_KEY:
        print("Error: SUPABASE_SERVICE_KEY or SUPABASE_KEY environment variable required")
        return

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    # latitude が NULL で address がある全イベントを取得
    result = supabase.table("adoption_events").select(
        "id, address, prefecture"
    ).is_("latitude", "null").neq("address", "").execute()

    events = result.data
    print(f"Found {len(events)} events without coordinates")

    success = 0
    failed = 0

    for i, event in enumerate(events):
        address = event.get("address", "")
        prefecture = event.get("prefecture", "")

        if not address:
            continue

        # 都道府県が住所に含まれていなければ先頭に追加
        search_address = address
        if prefecture and not address.startswith(prefecture):
            search_address = prefecture + address

        print(f"[{i+1}/{len(events)}] Geocoding: {search_address}")
        coords = geocode_address(search_address)

        if coords:
            lat, lng = coords
            print(f"  -> ({lat}, {lng})")
            supabase.table("adoption_events").update({
                "latitude": lat,
                "longitude": lng
            }).eq("id", event["id"]).execute()
            success += 1
        else:
            # 都道府県のみで再試行
            if prefecture:
                print(f"  Retrying with prefecture only: {prefecture}")
                coords = geocode_address(prefecture)
                if coords:
                    lat, lng = coords
                    print(f"  -> ({lat}, {lng}) (prefecture level)")
                    supabase.table("adoption_events").update({
                        "latitude": lat,
                        "longitude": lng
                    }).eq("id", event["id"]).execute()
                    success += 1
                else:
                    failed += 1
            else:
                failed += 1

        # Rate limiting: 1 request per second
        time.sleep(1)

    print(f"\nDone! Success: {success}, Failed: {failed}")


if __name__ == "__main__":
    main()
