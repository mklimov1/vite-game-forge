import * as networkConfigs from "../networkConfigs";

export const resolveNetwork = (name = "develop") => {
  const config = networkConfigs[name as keyof typeof networkConfigs];
  return config ?? networkConfigs.develop;
};
