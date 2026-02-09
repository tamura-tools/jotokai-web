# -*- coding: utf-8 -*-
"""
GSI API でジオコーディングし、SQL UPDATE 文を出力する。
出力: geocode_results.sql
"""
import json
import re
import sys
import time
import urllib.parse
import urllib.request

GSI_URL = "https://msearch.gsi.go.jp/address-search/AddressSearch"

EVENTS = [
    {"id":"7b05fb7a-3299-4ff3-8be0-030a145b635e","address":"奈良県生駒郡斑鳩町目安"},
    {"id":"ab5fd4f4-a396-4b3f-b520-84858fc630ec","address":"三重県伊賀市上神戸4615-210"},
    {"id":"372e1f3a-fc22-42ec-9d96-55b3a497b8d7","address":"大阪府松原市一津屋5-1-2"},
    {"id":"aa9c3f90-7fe3-4067-9cb7-c1cccb20ec9b","address":"愛知県名古屋市緑区鳴海町字本町54"},
    {"id":"269bb908-0be2-40d6-b1fa-68312e24fc9a","address":"奈良県大和高田市永和町5-2"},
    {"id":"ca7f4a69-a4f2-4805-a92e-76d3274d12f9","address":"千葉県八千代市村上1245"},
    {"id":"ea14dca2-638d-4cf8-95e5-19339c7691a7","address":"宮城県仙台市宮城野区新田3丁目18-25"},
    {"id":"ae72f19d-9a6d-4c2a-a30a-dba2254cc945","address":"山口県山口市道場門前2-3-6"},
    {"id":"c4d3f896-60dd-46e4-b76b-d4de7005ab1a","address":"岐阜県岐阜市上加納山4717-4"},
    {"id":"7da3b6b5-f877-4a1d-9c73-e28684122750","address":"奈良県生駒郡斑鳩町目安"},
    {"id":"e284960b-f018-4309-8632-ef7b8aef313b","address":"愛知県あま市七宝町遠島十三割2000"},
    {"id":"8bc06421-8eca-4f99-a04e-720aa99377ad","address":"東京都杉並区本天沼1-1-13"},
    {"id":"38d1c626-aff5-4331-bd03-e15cdd2bc527","address":"福岡県福岡市西区拾六町2丁目1-1"},
    {"id":"95b3ddf4-13b8-4c04-bd76-fca0a2fa1480","address":"東京都町田市金井"},
    {"id":"580fc3b0-251f-41ae-a0b0-f427d7e9205a","address":"東京都新宿区赤城元町4-11"},
    {"id":"b0e8d4cf-a536-4835-96a0-c336a803b644","address":"千葉県印西市牧の原2-1"},
    {"id":"e7e2e564-c73a-4d9a-81c7-ba5529998544","address":"岐阜県岐阜市小柳町18-6"},
    {"id":"579535f7-1231-4dee-a592-d0fff3ca6aff","address":"山口県周南市皿山町10-19"},
    {"id":"fc654036-893d-4606-b5a3-8b393afeecea","address":"大阪府八尾市中田4丁目136-3"},
    {"id":"da32ee44-2ebb-46f1-8db5-9568b153bbe8","address":"東京都中央区月島4-1-1"},
    {"id":"e26c55e3-15b5-4545-a3c0-3e7c2e4cb054","address":"奈良県奈良市東城戸町52"},
    {"id":"bca1eab6-bd6e-4ae3-b77a-764d88dddea3","address":"神奈川県横浜市鶴見区豊岡町31-23"},
    {"id":"b9d53b41-04e3-4602-8fd0-f9688b40f2fc","address":"千葉県市原市うるいど南4-1"},
    {"id":"5c0657dd-e9a2-4514-b4c4-9b2bf09a111f","address":"愛知県名古屋市緑区鳴海町字本町54"},
    {"id":"f160557e-8727-4d90-b058-ed3599191f93","address":"神奈川県相模原市南区古淵3丁目6-8"},
    {"id":"3778c45d-203a-4029-aeb4-7cd1e442f75a","address":"大阪府吹田市春日1-15-5"},
    {"id":"199a76a2-aee2-4cb4-aac5-58e7088093e2","address":"東京都足立区大谷田4-9-20"},
    {"id":"a16d11de-0f74-4476-afae-7544048048b0","address":"東京都北区西ヶ原1-3-7"},
    {"id":"3267db26-3a7b-46a7-b3ce-2c78be9b3bc0","address":"千葉県千葉市緑区おゆみ野中央1-15-21"},
    {"id":"7552be48-733f-4530-840c-b4a44c493234","address":"千葉県千葉市稲毛区緑町1-22-10"},
    {"id":"6607a9cc-4e27-41b8-9256-ca42c3e54beb","address":"千葉県八千代市村上2723-1"},
    {"id":"82ff674f-dd32-413a-9fed-ff3c93117936","address":"宮城県仙台市太白区柳生7-4-1"},
    {"id":"4eee325d-cf22-48ab-a4d7-547f7693bb86","address":"東京都中央区日本橋小舟町4-1"},
    {"id":"2819c2d8-b632-40bd-ac12-84ae422208c0","address":"埼玉県さいたま市西区土屋584-3"},
    {"id":"2745bb90-b363-4eaf-bc79-4f5f8c21c240","address":"三重県名張市東町1753-7"},
    {"id":"65e7d36c-c487-451e-b8cb-380893292e0c","address":"大阪府大阪市旭区生江3-29-1"},
    {"id":"adbb28b8-1347-4461-881c-e058950cc9c3","address":"東京都町田市金井"},
    {"id":"626c269b-ed30-4bc4-89cf-a6cfc454ec4c","address":"愛知県あま市七宝町遠島十三割2000"},
    {"id":"ffab53fb-c7e7-4821-8396-a7b5025eb235","address":"岐阜県各務原市川島笠田町1564-1"},
    {"id":"f5bf5876-d65c-4a62-9945-d41741f7bd2f","address":"東京都文京区千駄木2-31-3"},
    {"id":"0c38539d-4065-4e15-91ca-67edeb3b4545","address":"大阪府八尾市中田4丁目136-3"},
    {"id":"56d08a64-deb8-49bf-90db-c01605a3fd69","address":"京都府京都市東山区七条本町西入日吉222"},
    {"id":"0e793466-9435-4977-96f0-5fe367a42acd","address":"山口県山口市阿知須源河区7418-8"},
    {"id":"a128db65-3afc-4143-9a6f-1c884c11ebd0","address":"愛知県尾張旭市北山町北山337-2"},
    {"id":"817751e7-271f-41dd-aed0-d3e45627ac87","address":"神奈川県横浜市保土ケ谷区川島町360-6"},
    {"id":"89128552-5f3f-4cc1-b627-0274a4dee6b4","address":"兵庫県神戸市東灘区青木5丁目17-6"},
    {"id":"6ee60a37-11bb-4549-a3d4-a3b95a04eb2a","address":"山口県山口市道場門前2-3-6"},
    {"id":"0c854782-0f8f-4a8c-b940-dbc6720f83d2","address":"兵庫県西宮市西宮浜1丁目31"},
    {"id":"cb528135-75e0-46ef-b24a-3835b92c944b","address":"東京都府中市八幡町1-4-2"},
    {"id":"5f16c66e-5c2f-4556-8198-73286779e3bd","address":"千葉県千葉市稲毛区緑町1-22-10"},
    {"id":"06d48549-20b7-434e-84c0-cfd53bb2659e","address":"愛知県名古屋市熱田区尾頭町2-22"},
    {"id":"72a19fb6-3665-4aac-86d5-ef19eb43446d","address":"大阪府堺市北区東浅香山町3-22-2"},
    {"id":"c0ac7605-dcd6-405e-bfdd-835238b5211e","address":"神奈川県相模原市南区古淵3丁目6-8"},
    {"id":"4946e972-0af9-4eba-b026-05ea1e0e411a","address":"東京都武蔵野市吉祥寺本町1-13-4"},
    {"id":"e519090e-80f2-4cba-80b7-f153fd7f945c","address":"埼玉県さいたま市西区土屋584-3"},
    {"id":"f7833350-5042-4e66-a920-30154ec51de4","address":"静岡県静岡市駿河区池田983"},
    {"id":"dd507618-7eff-43b1-a525-7eb17529b7fd","address":"山口県山口市阿知須源河区7418-8"},
    {"id":"1f19eaed-6c9b-41a2-adcf-6fc84a937501","address":"千葉県千葉市稲毛区小仲台2-13-5"},
    {"id":"e9b885ea-c66c-4a59-9300-4ae0d4d4aaa9","address":"千葉県千葉市中央区弁天1-6-9"},
]

# Cache to avoid duplicate API calls for same address
cache = {}

def geocode(address):
    if address in cache:
        return cache[address]

    params = urllib.parse.urlencode({"q": address})
    url = f"{GSI_URL}?{params}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "jotokai-web/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        if data and len(data) > 0:
            coords = data[0].get("geometry", {}).get("coordinates", [])
            if len(coords) == 2:
                result = (float(coords[1]), float(coords[0]))  # lat, lng
                cache[address] = result
                return result
    except Exception as e:
        print(f"  Error: {e}", file=sys.stderr)

    cache[address] = None
    return None

def main():
    results = []
    for i, ev in enumerate(EVENTS):
        addr = ev["address"]
        print(f"[{i+1}/{len(EVENTS)}] {addr}", file=sys.stderr)
        coords = geocode(addr)
        if coords:
            lat, lng = coords
            results.append((ev["id"], lat, lng))
            print(f"  -> {lat}, {lng}", file=sys.stderr)
        else:
            print(f"  -> FAILED", file=sys.stderr)
        time.sleep(0.5)

    # Output SQL
    print("-- Geocoding results")
    for eid, lat, lng in results:
        print(f"UPDATE adoption_events SET latitude = {lat}, longitude = {lng} WHERE id = '{eid}';")

    print(f"\n-- Total: {len(results)}/{len(EVENTS)} geocoded", file=sys.stderr)

if __name__ == "__main__":
    main()
