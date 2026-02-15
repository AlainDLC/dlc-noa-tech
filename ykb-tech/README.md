# 🚀 Project: YKB-Marketplace – Transaktionslogik & Incheckningsflöde

Detta dokument beskriver escrow-lösningen och det automatiserade ekonomiska flödet mellan **Elev**, **Partner (Skola)** och **Admin**.

---

## 🏗 Systemarkitektur: Status & Pengar

### 1. Betalningsfas (Escrow)

När eleven genomför ett köp på marknadsplatsen hamnar pengarna hos Admin.

- **Bokningsstatus:** `paid`
- **Admin Vy:** Hela beloppet visas under `Gross Volume`.
- **Partner Vy:** Beloppet visas som **"Hålls av Admin (Låst)"**. Skolan ser att en plats är bokad men pengarna är ej tillgängliga.

### 2. Verifieringsfas (QR-Scanning)

När eleven anländer till kursen scannar skolan elevens QR-kod med **YKB Scanner**.

- **Trigger:** Skolan trycker på "Bekräfta Närvaro".
- **Action:** Systemet utför en `UPDATE` i databasen.
- **Statusändring:** `paid` → `Completed`.

### 3. Automatisk Splitt (Commission)

Vid incheckning räknar systemet ut provisionen direkt i `bookings`-tabellen.

- **Formel:** `amount` - `commission_amount` = `Partner_Net`.
- **Provision:** 15% (Admin Profit).
- **Partner Vy:** Pengarna flyttas direkt från "Låst" till **"Klart för utbetalning"** (Grön box).

---

## 💸 Räkneexempel (7 500 kr kurs)

| Aktör       | Belopp / Status | Beskrivning                     |
| :---------- | :-------------- | :------------------------------ |
| **Elev**    | 7 500 kr        | Betalat totalpris.              |
| **Admin**   | 1 125 kr        | Net Profit (15% provision).     |
| **Partner** | 6 375 kr        | Realized Net (85% utbetalning). |

---

## 🛠 Databasstruktur (Supabase)

Systemet förlitar sig på följande kritiska kolumner i tabellen `bookings`:

| Kolumn              | Typ     | Syfte                               |
| :------------------ | :------ | :---------------------------------- |
| `id`                | UUID    | Genererar QR-koden.                 |
| `status`            | Text    | Styr flödet (`paid` / `Completed`). |
| `amount`            | Numeric | Bruttobelopp från kund.             |
| `commission_amount` | Numeric | Beräknad provision (15%).           |
| `partner_id`        | UUID    | Kopplar bokningen till rätt skola.  |

---

## 🔄 Utbetalningsprocess (Settlement)

1.  **Request:** Partner trycker på "Begär utbetalning" i sin dashboard.
2.  **Approval:** Admin ser begäran under `New Requests`.
3.  **Settlement:** Admin trycker på `Process Request`.
4.  **Realized:** Siffran för utbetalt belopp uppdateras i Admin-panelen.

---

**Status:** ✅ Teknik fungerar | 🛠 Skönhetsfel återstår | 🔜 Stripe Connect Integration
