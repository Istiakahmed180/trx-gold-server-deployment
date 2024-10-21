import { Router } from "express";
import { SiteSettingsController } from "./settings.controller";
const router = Router();

router.get(
  "/get-site-settings",
  SiteSettingsController.SiteSettingsGet // <-- New route for GET request
);

export const siteSettingsRouter = router;
