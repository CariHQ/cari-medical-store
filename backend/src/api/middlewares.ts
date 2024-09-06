import { defineMiddlewares } from "@medusajs/medusa";
import { authenticate } from "@medusajs/medusa/dist/utils";

const isAllowed = (req: any, res: any, next: any) => {
  const { vendor_id, driver_id } = req.auth_context.app_metadata;

  if (vendor_id || driver_id) {
    const user = {
      actor_type: vendor_id ? "vendor" : "driver",
      user_id: vendor_id || driver_id,
    };

    req.user = user;

    next();
  } else {
    res.status(403).json({
      message: "Forbidden. Reason: No vendor_id or driver_id in app_metadata",
    });
  }
};

export default defineMiddlewares({
  routes: [
    {
      method: ["GET"],
      matcher: "/users/me",
      middlewares: [authenticate(["driver", "vendor"], "bearer"), isAllowed],
    },
    {
      method: ["POST"],
      matcher: "/users",
      middlewares: [
        authenticate(["driver", "vendor"], "bearer", {
          allowUnregistered: true,
        }),
      ],
    },
    {
      method: ["POST"],
      matcher: "/vendors/:id/products",
      middlewares: [
        authenticate(["vendor", "admin"], "bearer", {
          allowUnregistered: true,
        }),
      ],
    },
  ],
});
