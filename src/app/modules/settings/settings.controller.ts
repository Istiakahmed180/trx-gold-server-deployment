import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SiteSettingsServices } from "./settings.service";

const SiteSettingsGet = catchAsync(async (req, res) => {
  const result = await SiteSettingsServices.GetSiteSettingsIntoDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Site Settings Retrieved Successfully",
    data: result,
  });
});

const SiteSettingsCreated = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await SiteSettingsServices.CreateSiteSettingsIntoDB(data);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Site Settings Created SuccessFull",
    data: result,
  });
});

export const SiteSettingsController = {
  SiteSettingsGet,
  SiteSettingsCreated,
};
