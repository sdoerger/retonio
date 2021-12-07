// MODELS
import { Retonio } from "./models/Retonio/Retonio.class";

export function retonio(id, apiCall, config = undefined) {
  // ----------
  // PINIA FROM RETONIO
  // ----------
  return new Retonio(
    id, // Pinia ID / AlertMapper
    apiCall, // Imported API call,
    config // Optional Retonio configuration file
  ).pinia();
}
