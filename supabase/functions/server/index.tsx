import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use("*", logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-7ce0e090/health", (c) => {
  return c.json({ status: "ok" });
});

// Register a new guest
app.post("/make-server-7ce0e090/register", async (c) => {
  try {
    const body = await c.req.json();
    const {
      name,
      side,
      phone,
      email,
      willAttend,
      guestsCount,
      photo,
    } = body;

    if (!name || !side) {
      return c.json(
        { error: "Name and side are required" },
        400,
      );
    }

    const guestId = `guest:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const guest = {
      id: guestId,
      name,
      side,
      phone: phone || "",
      email: email || "",
      willAttend: willAttend ?? true,
      guestsCount: guestsCount || 1,
      photo: photo || null,
      createdAt: new Date().toISOString(),
    };

    await kv.set(guestId, guest);
    console.log(
      `Guest registered successfully: ${guestId} - ${name}`,
    );
    return c.json({ success: true, guest });
  } catch (error) {
    console.log(`Registration error: ${error}`);
    return c.json(
      { error: `Failed to register guest: ${error.message}` },
      500,
    );
  }
});

// Get all registered guests
app.get("/make-server-7ce0e090/guests", async (c) => {
  try {
    const guests = await kv.getByPrefix("guest:");
    console.log(`Retrieved ${guests.length} guests`);
    return c.json({ guests });
  } catch (error) {
    console.log(`Error fetching guests: ${error}`);
    return c.json(
      { error: `Failed to fetch guests: ${error.message}` },
      500,
    );
  }
});

// Book a gift
app.post("/make-server-7ce0e090/gift/book", async (c) => {
  try {
    const body = await c.req.json();
    const { giftId, guestId, guestName, selectedCountry } =
      body;

    if (!giftId || !guestId || !guestName) {
      return c.json(
        {
          error:
            "Gift ID, guest ID, and guest name are required",
        },
        400,
      );
    }

    const numericGiftId = Number(giftId);
    const travelGiftIds = [15, 16];
    const isTravelGift = travelGiftIds.includes(numericGiftId);

    if (isTravelGift && !selectedCountry) {
      return c.json(
        { error: "Country is required for travel gift" },
        400,
      );
    }

    if (isTravelGift) {
      const travelBookings = [
        ...(await kv.getByPrefix("gift:15:")),
        ...(await kv.getByPrefix("gift:16:")),
      ];
      const existingGuestTravelBooking = travelBookings.find(
        (booking) => booking.guestId === guestId,
      );

      if (existingGuestTravelBooking) {
        return c.json(
          {
            error: "Guest can choose only one travel country",
            selectedCountry:
              existingGuestTravelBooking.selectedCountry,
          },
          409,
        );
      }
    }

    const bookingKey = isTravelGift
      ? `gift:${numericGiftId}:${guestId}`
      : `gift:${numericGiftId}`;
    const existingBooking = await kv.get(bookingKey);

    if (existingBooking) {
      console.log(
        `Gift ${numericGiftId} already booked by ${existingBooking.guestName}`,
      );
      return c.json(
        {
          error: "This gift is already booked",
          bookedBy: existingBooking.guestName,
        },
        409,
      );
    }

    const booking = {
      giftId: numericGiftId,
      guestId,
      guestName,
      selectedCountry: selectedCountry || null,
      bookedAt: new Date().toISOString(),
    };

    await kv.set(bookingKey, booking);
    console.log(
      `Gift ${numericGiftId} booked successfully by ${guestName}`,
    );
    return c.json({ success: true, booking });
  } catch (error) {
    console.log(`Gift booking error: ${error}`);
    return c.json(
      { error: `Failed to book gift: ${error.message}` },
      500,
    );
  }
});

// Get all gift bookings
app.get("/make-server-7ce0e090/gifts", async (c) => {
  try {
    const bookings = await kv.getByPrefix("gift:");
    console.log(`Retrieved ${bookings.length} gift bookings`);
    return c.json({ bookings });
  } catch (error) {
    console.log(`Error fetching gift bookings: ${error}`);
    return c.json(
      {
        error: `Failed to fetch gift bookings: ${error.message}`,
      },
      500,
    );
  }
});

// Unbook a gift (if needed for cancellation)
app.delete("/make-server-7ce0e090/gift/:giftId", async (c) => {
  try {
    const giftId = c.req.param("giftId");
    const bookingKey = `gift:${giftId}`;

    await kv.del(bookingKey);
    console.log(`Gift ${giftId} unbookmarked successfully`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Gift unbooking error: ${error}`);
    return c.json(
      { error: `Failed to unbook gift: ${error.message}` },
      500,
    );
  }
});

// Add music wish
app.post("/make-server-7ce0e090/music", async (c) => {
  try {
    const body = await c.req.json();
    const { song, guestName } = body;

    if (!song) {
      return c.json({ error: "Song is required" }, 400);
    }

    const musicId = `music:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const musicWish = {
      id: musicId,
      song,
      guestName: guestName || "Гость",
      createdAt: new Date().toISOString(),
    };

    await kv.set(musicId, musicWish);
    console.log(`Music wish added: ${musicId} - ${song}`);
    return c.json({ success: true, musicWish });
  } catch (error) {
    console.log(`Music wish error: ${error}`);
    return c.json(
      { error: `Failed to add music wish: ${error.message}` },
      500,
    );
  }
});

// Get all music wishes
app.get("/make-server-7ce0e090/music", async (c) => {
  try {
    const wishes = await kv.getByPrefix("music:");
    console.log(`Retrieved ${wishes.length} music wishes`);
    return c.json({ wishes });
  } catch (error) {
    console.log(`Error fetching music wishes: ${error}`);
    return c.json(
      {
        error: `Failed to fetch music wishes: ${error.message}`,
      },
      500,
    );
  }
});

Deno.serve(app.fetch);