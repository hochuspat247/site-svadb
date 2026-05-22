import "dotenv/config";
import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  isValidAdminPassword,
  issueAdminToken,
  verifyAdminToken,
} from "./admin-auth.js";
import { getPool, query } from "./db.js";
import { ensureSchema, ensureSeedData } from "./schema-manager.js";

const app = express();
const port = Number(process.env.PORT || 3001);
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

function safeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function parseGuestsCount(value) {
  const guestsCount = Number(value);

  if (!Number.isFinite(guestsCount) || guestsCount < 1) {
    return 1;
  }

  return Math.round(guestsCount);
}

function parseOptionalAmount(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function parseTravelOptions(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => ({
        label: safeText(item?.label),
        value: safeText(item?.value || item?.label),
      }))
      .filter((item) => item.label && item.value);
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => safeText(item))
      .filter(Boolean)
      .map((item) => ({ label: item, value: item }));
  }

  return [];
}

function slugifyId(value) {
  return safeText(value)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

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

function mapGiftCategory(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    sortOrder: row.sort_order,
  };
}

function mapGift(row) {
  return {
    id: row.id,
    name: row.name,
    hint: row.hint,
    iconKey: row.icon_key,
    priceLabel: row.price_label,
    categoryId: row.category_id,
    categoryName: row.category_name,
    categoryDescription: row.category_description,
    featured: row.featured,
    link: row.link,
    bookingMode: row.booking_mode,
    specialCode: row.special_code,
    suggestedAmount:
      row.suggested_amount === null ? null : Number(row.suggested_amount),
    conditionsText: row.conditions_text,
    travelOptions: Array.isArray(row.travel_options) ? row.travel_options : [],
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapGiftBooking(row) {
  return {
    id: row.id,
    giftId: row.gift_id,
    guestId: row.guest_id,
    guestName: row.guest_name,
    selectedCountry: row.selected_country,
    contributionAmount:
      row.contribution_amount === null ? null : Number(row.contribution_amount),
    giftBookingMode: row.gift_booking_mode,
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

async function getGuests() {
  const result = await query(
    `
      select *
      from guests
      order by created_at asc
    `,
  );

  return result.rows.map(mapGuest);
}

async function getGiftCategories() {
  const result = await query(
    `
      select *
      from gift_categories
      order by sort_order asc, name asc
    `,
  );

  return result.rows.map(mapGiftCategory);
}

async function getGifts({ includeInactive = false } = {}) {
  const result = await query(
    `
      select
        g.*,
        c.name as category_name,
        c.description as category_description
      from gifts g
      join gift_categories c on c.id = g.category_id
      ${includeInactive ? "" : "where g.is_active = true"}
      order by g.sort_order asc, g.id asc
    `,
  );

  return result.rows.map(mapGift);
}

async function getGiftBookings() {
  const result = await query(
    `
      select *
      from gift_bookings
      order by booked_at asc
    `,
  );

  return result.rows.map(mapGiftBooking);
}

async function getMusicWishes() {
  const result = await query(
    `
      select *
      from music_wishes
      order by created_at asc
    `,
  );

  return result.rows.map(mapMusicWish);
}

async function getGiftById(id) {
  const result = await query(
    `
      select
        g.*,
        c.name as category_name,
        c.description as category_description
      from gifts g
      join gift_categories c on c.id = g.category_id
      where g.id = $1
      limit 1
    `,
    [id],
  );

  return result.rows[0] ? mapGift(result.rows[0]) : null;
}

function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  if (!verifyAdminToken(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
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

app.post("/api/admin/login", (req, res) => {
  const password = safeText(req.body?.password);

  if (!isValidAdminPassword(password)) {
    res.status(401).json({ error: "Неверный пароль" });
    return;
  }

  res.json({
    success: true,
    token: issueAdminToken(),
  });
});

app.get("/api/admin/bootstrap", requireAdminAuth, async (_req, res) => {
  try {
    const [guests, categories, gifts, bookings, wishes] = await Promise.all([
      getGuests(),
      getGiftCategories(),
      getGifts({ includeInactive: true }),
      getGiftBookings(),
      getMusicWishes(),
    ]);

    res.json({
      guests,
      categories,
      gifts,
      bookings,
      wishes,
    });
  } catch (error) {
    console.error("Admin bootstrap error", error);
    res.status(500).json({ error: "Failed to load admin data" });
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
    res.json({
      guests: await getGuests(),
    });
  } catch (error) {
    console.error("Guests fetch error", error);
    res.status(500).json({ error: "Failed to fetch guests" });
  }
});

app.post("/api/admin/guests", requireAdminAuth, async (req, res) => {
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
    res.status(400).json({ error: "Имя и сторона обязательны" });
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

    res.status(201).json({ guest: mapGuest(result.rows[0]) });
  } catch (error) {
    console.error("Admin guest create error", error);
    res.status(500).json({ error: "Не удалось создать гостя" });
  }
});

app.put("/api/admin/guests/:id", requireAdminAuth, async (req, res) => {
  const guestId = req.params.id;
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
    res.status(400).json({ error: "Имя и сторона обязательны" });
    return;
  }

  try {
    const result = await query(
      `
        update guests
        set
          name = $2,
          side = $3,
          phone = $4,
          email = $5,
          will_attend = $6,
          attendance_label = $7,
          guests_count = $8,
          guest_names = $9,
          drink = $10,
          allergy = $11,
          photo = $12
        where id = $1
        returning *
      `,
      [
        guestId,
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

    if (!result.rowCount) {
      res.status(404).json({ error: "Гость не найден" });
      return;
    }

    res.json({ guest: mapGuest(result.rows[0]) });
  } catch (error) {
    console.error("Admin guest update error", error);
    res.status(500).json({ error: "Не удалось обновить гостя" });
  }
});

app.delete("/api/admin/guests/:id", requireAdminAuth, async (req, res) => {
  try {
    await query("delete from guests where id = $1", [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.error("Admin guest delete error", error);
    res.status(500).json({ error: "Не удалось удалить гостя" });
  }
});

app.get("/api/gifts", async (_req, res) => {
  try {
    const [categories, gifts] = await Promise.all([
      getGiftCategories(),
      getGifts(),
    ]);

    res.json({ categories, gifts });
  } catch (error) {
    console.error("Gift catalog error", error);
    res.status(500).json({ error: "Failed to fetch gifts" });
  }
});

app.get("/api/gift-bookings", async (_req, res) => {
  try {
    res.json({
      bookings: await getGiftBookings(),
    });
  } catch (error) {
    console.error("Gift booking fetch error", error);
    res.status(500).json({ error: "Failed to fetch gift bookings" });
  }
});

app.post("/api/admin/categories", requireAdminAuth, async (req, res) => {
  const name = safeText(req.body?.name);
  const description = safeText(req.body?.description);
  const requestedId = safeText(req.body?.id);
  const sortOrder = Number(req.body?.sortOrder ?? 0);
  const categoryId = slugifyId(requestedId || name);

  if (!name || !categoryId) {
    res.status(400).json({ error: "Название категории обязательно" });
    return;
  }

  try {
    const result = await query(
      `
        insert into gift_categories (id, name, description, sort_order)
        values ($1, $2, $3, $4)
        returning *
      `,
      [categoryId, name, description, Number.isFinite(sortOrder) ? sortOrder : 0],
    );

    res.status(201).json({ category: mapGiftCategory(result.rows[0]) });
  } catch (error) {
    console.error("Category create error", error);
    res.status(500).json({ error: "Не удалось создать категорию" });
  }
});

app.put("/api/admin/categories/:id", requireAdminAuth, async (req, res) => {
  const categoryId = req.params.id;
  const name = safeText(req.body?.name);
  const description = safeText(req.body?.description);
  const sortOrder = Number(req.body?.sortOrder ?? 0);

  if (!name) {
    res.status(400).json({ error: "Название категории обязательно" });
    return;
  }

  try {
    const result = await query(
      `
        update gift_categories
        set name = $2, description = $3, sort_order = $4
        where id = $1
        returning *
      `,
      [categoryId, name, description, Number.isFinite(sortOrder) ? sortOrder : 0],
    );

    if (!result.rowCount) {
      res.status(404).json({ error: "Категория не найдена" });
      return;
    }

    res.json({ category: mapGiftCategory(result.rows[0]) });
  } catch (error) {
    console.error("Category update error", error);
    res.status(500).json({ error: "Не удалось обновить категорию" });
  }
});

app.delete("/api/admin/categories/:id", requireAdminAuth, async (req, res) => {
  const categoryId = req.params.id;

  try {
    const giftCount = await query(
      "select count(*)::int as count from gifts where category_id = $1",
      [categoryId],
    );

    if (giftCount.rows[0].count > 0) {
      res.status(409).json({
        error: "Сначала удалите или перенесите подарки из этой категории",
      });
      return;
    }

    await query("delete from gift_categories where id = $1", [categoryId]);
    res.json({ success: true });
  } catch (error) {
    console.error("Category delete error", error);
    res.status(500).json({ error: "Не удалось удалить категорию" });
  }
});

app.post("/api/admin/gifts", requireAdminAuth, async (req, res) => {
  const {
    name,
    hint = "",
    iconKey = "Gift",
    priceLabel = "",
    categoryId = "",
    featured = false,
    link = "",
    bookingMode = "single",
    specialCode = "",
    suggestedAmount = null,
    conditionsText = "",
    travelOptions = [],
    isActive = true,
    sortOrder = 0,
  } = req.body ?? {};

  if (!safeText(name) || !safeText(categoryId)) {
    res.status(400).json({ error: "Название подарка и категория обязательны" });
    return;
  }

  const nextIdResult = await query("select coalesce(max(id), 0) + 1 as next_id from gifts");
  const nextId = nextIdResult.rows[0].next_id;

  try {
    const result = await query(
      `
        insert into gifts (
          id,
          name,
          hint,
          icon_key,
          price_label,
          category_id,
          featured,
          link,
          booking_mode,
          special_code,
          suggested_amount,
          conditions_text,
          travel_options,
          is_active,
          sort_order
        )
        values (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12,
          $13::jsonb, $14, $15
        )
        returning *
      `,
      [
        nextId,
        safeText(name),
        safeText(hint),
        safeText(iconKey) || "Gift",
        safeText(priceLabel),
        safeText(categoryId),
        Boolean(featured),
        safeText(link),
        ["single", "multiple", "travel"].includes(bookingMode) ? bookingMode : "single",
        safeText(specialCode),
        parseOptionalAmount(suggestedAmount),
        safeText(conditionsText),
        JSON.stringify(parseTravelOptions(travelOptions)),
        Boolean(isActive),
        Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : nextId,
      ],
    );

    const created = await getGiftById(result.rows[0].id);
    res.status(201).json({ gift: created });
  } catch (error) {
    console.error("Gift create error", error);
    res.status(500).json({ error: "Не удалось создать подарок" });
  }
});

app.put("/api/admin/gifts/:id", requireAdminAuth, async (req, res) => {
  const giftId = Number(req.params.id);
  const {
    name,
    hint = "",
    iconKey = "Gift",
    priceLabel = "",
    categoryId = "",
    featured = false,
    link = "",
    bookingMode = "single",
    specialCode = "",
    suggestedAmount = null,
    conditionsText = "",
    travelOptions = [],
    isActive = true,
    sortOrder = 0,
  } = req.body ?? {};

  if (!giftId || !safeText(name) || !safeText(categoryId)) {
    res.status(400).json({ error: "Название подарка и категория обязательны" });
    return;
  }

  try {
    const result = await query(
      `
        update gifts
        set
          name = $2,
          hint = $3,
          icon_key = $4,
          price_label = $5,
          category_id = $6,
          featured = $7,
          link = $8,
          booking_mode = $9,
          special_code = $10,
          suggested_amount = $11,
          conditions_text = $12,
          travel_options = $13::jsonb,
          is_active = $14,
          sort_order = $15,
          updated_at = now()
        where id = $1
        returning *
      `,
      [
        giftId,
        safeText(name),
        safeText(hint),
        safeText(iconKey) || "Gift",
        safeText(priceLabel),
        safeText(categoryId),
        Boolean(featured),
        safeText(link),
        ["single", "multiple", "travel"].includes(bookingMode) ? bookingMode : "single",
        safeText(specialCode),
        parseOptionalAmount(suggestedAmount),
        safeText(conditionsText),
        JSON.stringify(parseTravelOptions(travelOptions)),
        Boolean(isActive),
        Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : giftId,
      ],
    );

    if (!result.rowCount) {
      res.status(404).json({ error: "Подарок не найден" });
      return;
    }

    const updated = await getGiftById(giftId);
    res.json({ gift: updated });
  } catch (error) {
    console.error("Gift update error", error);
    res.status(500).json({ error: "Не удалось обновить подарок" });
  }
});

app.delete("/api/admin/gifts/:id", requireAdminAuth, async (req, res) => {
  const giftId = Number(req.params.id);

  if (!giftId) {
    res.status(400).json({ error: "Некорректный идентификатор подарка" });
    return;
  }

  try {
    await query("delete from gift_bookings where gift_id = $1", [giftId]);
    await query("delete from gifts where id = $1", [giftId]);
    res.json({ success: true });
  } catch (error) {
    console.error("Gift delete error", error);
    res.status(500).json({ error: "Не удалось удалить подарок" });
  }
});

app.post("/api/gift/book", async (req, res) => {
  const {
    giftId,
    guestId,
    guestName,
    selectedCountry,
    contributionAmount,
  } = req.body ?? {};
  const numericGiftId = Number(giftId);

  if (!numericGiftId || !guestId || !safeText(guestName)) {
    res.status(400).json({
      error: "Gift ID, guest ID, and guest name are required",
    });
    return;
  }

  try {
    const [guestExists, gift] = await Promise.all([
      query("select id from guests where id = $1", [guestId]),
      getGiftById(numericGiftId),
    ]);

    if (!guestExists.rowCount) {
      res.status(404).json({ error: "Guest not found" });
      return;
    }

    if (!gift || !gift.isActive) {
      res.status(404).json({ error: "Gift not found" });
      return;
    }

    const bookingMode = gift.bookingMode;
    const parsedAmount = parseOptionalAmount(contributionAmount);

    if (bookingMode === "travel") {
      if (!safeText(selectedCountry)) {
        res.status(400).json({
          error: "Country is required for travel gift",
        });
        return;
      }

      const allowedCountries = new Set(
        (gift.travelOptions || []).map((item) => safeText(item.value || item.label)),
      );

      if (allowedCountries.size > 0 && !allowedCountries.has(safeText(selectedCountry))) {
        res.status(400).json({ error: "Invalid travel option" });
        return;
      }

      const existingGuestTravelBooking = await query(
        `
          select gb.*
          from gift_bookings gb
          join gifts g on g.id = gb.gift_id
          where gb.guest_id = $1
            and g.booking_mode = 'travel'
          limit 1
        `,
        [guestId],
      );

      if (existingGuestTravelBooking.rowCount) {
        res.status(409).json({
          error: "Guest can choose only one travel country",
          selectedCountry: existingGuestTravelBooking.rows[0].selected_country,
        });
        return;
      }
    }

    if (bookingMode === "single") {
      const existingSingleBooking = await query(
        `
          select guest_name
          from gift_bookings
          where gift_id = $1
          limit 1
        `,
        [numericGiftId],
      );

      if (existingSingleBooking.rowCount) {
        res.status(409).json({
          error: "This gift is already booked",
          bookedBy: existingSingleBooking.rows[0].guest_name,
        });
        return;
      }
    }

    const result = await query(
      `
        insert into gift_bookings (
          gift_id,
          guest_id,
          guest_name,
          selected_country,
          contribution_amount,
          gift_booking_mode
        )
        values ($1, $2, $3, $4, $5, $6)
        returning *
      `,
      [
        numericGiftId,
        guestId,
        safeText(guestName),
        bookingMode === "travel" ? safeText(selectedCountry) : null,
        parsedAmount,
        bookingMode,
      ],
    );

    res.status(201).json({
      success: true,
      booking: mapGiftBooking(result.rows[0]),
    });
  } catch (error) {
    console.error("Gift booking error", error);
    res.status(500).json({ error: "Failed to book gift" });
  }
});

app.delete("/api/gift/:giftId", requireAdminAuth, async (req, res) => {
  const numericGiftId = Number(req.params.giftId);
  const guestId = safeText(req.query?.guestId);

  if (!numericGiftId) {
    res.status(400).json({ error: "Valid gift ID is required" });
    return;
  }

  try {
    const gift = await getGiftById(numericGiftId);

    if (!gift) {
      res.status(404).json({ error: "Gift not found" });
      return;
    }

    if (gift.bookingMode === "travel" && guestId) {
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
    console.error("Gift delete booking error", error);
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
    res.json({
      wishes: await getMusicWishes(),
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
    await ensureSchema();
    await ensureSeedData();
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
