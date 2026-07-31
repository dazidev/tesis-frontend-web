import { ProcessType } from "@/interfaces";

export function getProcessTypeName(type: ProcessType) {
  let name;

  switch (type) {
    case "testate":
      name = "Testamentario";
      break;

    case "intestate":
      name = "Intestamentario";
      break;

    case "mixed":
      name = "Mixto";
      break;

    default:
      name = type;
      break;
  }

  return name;
}
