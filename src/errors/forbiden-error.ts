import { ApplicationError } from "@/protocols";

function forbiddenError(): ApplicationError {
  return {
    name: "ForbiddenError",
    message: "Forbiden acess",
  };
}
export { forbiddenError };
