 
 
 

import { TSettings } from "./settings.interface";
import { Settings } from "./settings.model";

const GetSiteSettingsIntoDB = async () => {
  const result = await Settings.find();
  return result;
};

const CreateSiteSettingsIntoDB = async (payload: TSettings) => {
  const result = await Settings.create(payload);
  return result;
};

export const SiteSettingsServices = {
  GetSiteSettingsIntoDB,
  CreateSiteSettingsIntoDB,
};
