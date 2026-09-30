// The new design uses typed review fixtures until the final Sanity projection is agreed.
// Fail explicitly if a project is configured prematurely; never silently build review
// fixtures in place of expected published content.
if (import.meta.env.PUBLIC_SANITY_PROJECT_ID) {
  throw new Error(
    "The Step 2 design projection is not connected to Sanity yet. Leave PUBLIC_SANITY_PROJECT_ID unset for this review stage.",
  );
}
export {
  equipmentGroups,
  heroSlides,
  partners,
  services,
  site,
  stories,
} from "../data/site";
