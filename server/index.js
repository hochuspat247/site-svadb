import "dotenv/config";
import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPool, query } from "./db.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const travelGiftIds = new Set([15, 16]);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");
const hasBuiltFrontend = fs.existsSync(distPath);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || true,
  }),
);
app.use(express.json({ limit: "10mb" }));

function mapGuest(row) {
  return {
    id: row.id,
    name: row.name,
    side: row.side,
    phone: row.phone,
    email: row.email,
    willAttend: row.will_attend,
    attendanceLabel: row.attendance_label,
    guestsCount: row.guests_count,
    guestNames: row.guest_names,
    drink: row.drink,
    allergy: row.allergy,
    photo: row.photo,
    createdAt: row.created_at,
  };
}

function mapGiftBooking(row) {
  return {
    id: row.id,
    giftId: row.gift_id,
    guestId: row.guest_id,
    guestName: row.guest_name,
    selectedCountry: row.selected_country,
    bookedAt: row.booked_at,
  };
}

function mapMusicWish(row) {
  return {
    id: row.id,
    song: row.song,
    guestId: row.guest_id,
    guestName: row.guest_name,
    createdAt: row.created_at,
  };
}

function parseGuestsCount(value) {
  const guestsCount = Number(value);

  if (!Number.isFinite(guestsCount) || guestsCount < 1) {
    return 1;
  }

  return Math.round(guestsCount);
}

function safeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

app.get("/api/health", async (_req, res) => {
  try {
    await query("select 1");
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Health check failed", error);
    res.status(500).json({ status: "error" });
  }
});

app.post("/api/register", async (req, res) => {
  const {
    name,
    side,
    phone = "",
    email = "",
    willAttend = true,
    attendanceLabel = "",
    guestsCount = 1,
    guestNames = "",
    drink = "",
    allergy = "",
    photo = null,
  } = req.body ?? {};

  if (!safeText(name) || !safeText(side)) {
    res.status(400).json({ error: "Name and side are required" });
    return;
  }

  try {
    const result = await query(
      `
        insert into guests (
          name,
          side,
          phone,
          email,
          will_attend,
          attendance_label,
          guests_count,
          guest_names,
          drink,
          allergy,
          photo
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        returning *
      `,
      [
        safeText(name),
        safeText(side),
        safeText(phone),
        safeText(email),
        Boolean(willAttend),
        safeText(attendanceLabel),
        parseGuestsCount(guestsCount),
        safeText(guestNames),
        safeText(drink),
        safeText(allergy),
        photo,
      ],
    );

    res.status(201).json({
      success: true,
      guest: mapGuest(result.rows[0]),
    });
  } catch (error) {
    console.error("Registration error", error);
    res.status(500).json({ error: "Failed to register guest" });
  }
});

app.get("/api/guests", async (_req, res) => {
  try {
    const result = await query(
      `
        select *
        from guests
        order by created_at asc
      `,
    );

    res.json({
      guests: result.rows.map(mapGuest),
    });
  } catch (error) {
    console.error("Guests fetch error", error);
    res.status(500).json({ error: "Failed to fetch guests" });
  }
});

app.post("/api/gift/book", async (req, res) => {
  const { giftId, guestId, guestName, selectedCountry } = req.body ?? {};
  const numericGiftId = Number(giftId);
  const isTravelGift = travelGiftIds.has(numericGiftId);

  if (!numericGiftId || !guestId || !safeText(guestName)) {
    res.status(400).json({
      error: "Gift ID, guest ID, and guest name are required",
    });
    return;
  }

  if (isTravelGift && !safeText(selectedCountry)) {
    res.status(400).json({
      error: "Country is required for travel gift",
    });
    return;
  }

  try {
    const guestExists = await query(
      "select id from guests where id = $1",
      [guestId],
    );

    if (!guestExists.rowCount) {
      res.status(404).json({ error: "Guest not found" });
      return;
    }

    const result = await query(
      `
        insert into gift_bookings (
          gift_id,
          guest_id,
          guest_name,
          selected_country
        )
        values ($1, $2, $3, $4)
        returning *
      `,
      [
        numericGiftId,
        guestId,
        safeText(guestName),
        isTravelGift ? safeText(selectedCountry) : null,
      ],
    );

    res.status(201).json({
      success: true,
      booking: mapGiftBooking(result.rows[0]),
    });
  } catch (error) {
    if (error?.code === "23505") {
      if (isTravelGift) {
        const existing = await query(
          `
            select *
            from gift_bookings
            where guest_id = $1
              and gift_id in (15, 16)
            order by booked_at desc
            limit 1
          `,
          [guestId],
        );

        res.status(409).json({
          error: "Guest can choose only one travel country",
          selectedCountry: existing.rows[0]?.selected_country ?? null,
        });
        return;
      }

      const existing = await query(
        `
          select guest_name
          from gift_bookings
          where gift_id = $1
          limit 1
        `,
        [numericGiftId],
      );

      res.status(409).json({
        error: "This gift is already booked",
        bookedBy: existing.rows[0]?.guest_name ?? null,
      });
      return;
    }

    console.error("Gift booking error", error);
    res.status(500).json({ error: "Failed to book gift" });
  }
});

app.get("/api/gifts", async (_req, res) => {
  try {
    const result = await query(
      `
        select *
        from gift_bookings
        order by booked_at asc
      `,
    );

    res.json({
      bookings: result.rows.map(mapGiftBooking),
    });
  } catch (error) {
    console.error("Gift fetch error", error);
    res.status(500).json({ error: "Failed to fetch gift bookings" });
  }
});

app.delete("/api/gift/:giftId", async (req, res) => {
  const numericGiftId = Number(req.params.giftId);
  const { guestId } = req.query;
  const isTravelGift = travelGiftIds.has(numericGiftId);

  if (!numericGiftId) {
    res.status(400).json({ error: "Valid gift ID is required" });
    return;
  }

  if (isTravelGift && !guestId) {
    res.status(400).json({
      error: "guestId is required to delete a travel gift booking",
    });
    return;
  }

  try {
    if (isTravelGift) {
      await query(
        `
          delete from gift_bookings
          where gift_id = $1 and guest_id = $2
        `,
        [numericGiftId, guestId],
      );
    } else {
      await query(
        `
          delete from gift_bookings
          where gift_id = $1
        `,
        [numericGiftId],
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Gift delete error", error);
    res.status(500).json({ error: "Failed to delete gift booking" });
  }
});

app.post("/api/music", async (req, res) => {
  const { song, guestName = "Guest", guestId = null } = req.body ?? {};

  if (!safeText(song)) {
    res.status(400).json({ error: "Song is required" });
    return;
  }

  try {
    const result = await query(
      `
        insert into music_wishes (
          song,
          guest_id,
          guest_name
        )
        values ($1, $2, $3)
        returning *
      `,
      [safeText(song), guestId, safeText(guestName) || "Guest"],
    );

    res.status(201).json({
      success: true,
      musicWish: mapMusicWish(result.rows[0]),
    });
  } catch (error) {
    console.error("Music wish error", error);
    res.status(500).json({ error: "Failed to add music wish" });
  }
});

app.get("/api/music", async (_req, res) => {
  try {
    const result = await query(
      `
        select *
        from music_wishes
        order by created_at asc
      `,
    );

    res.json({
      wishes: result.rows.map(mapMusicWish),
    });
  } catch (error) {
    console.error("Music fetch error", error);
    res.status(500).json({ error: "Failed to fetch music wishes" });
  }
});

if (hasBuiltFrontend) {
  app.use(express.static(distPath));

  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

async function start() {
  try {
    await getPool().query("select 1");
    app.listen(port, () => {
      console.log(`Wedding backend is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start backend", error);
    process.exit(1);
  }
}

start();
