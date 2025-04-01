export const serverUrl = process.env.SERVER_URL || "http://localhost:3000";
export const apiUrl =
  `${process.env.SERVER_URL}/api/${process.env.API_VERSION}` ||
  "http://localhost:3000/api/v1";

export const projectId = assertValue(
  process.env.PROJECT_ID,
  "Project Id is not defined in Environment"
);

function assertValue<T>(v: T | undefined, errorMessage: string) {
  console.log(process.env.PROJECT_ID);
  console.log(process.env.SERVER_URL);
  // if (v === undefined) {
  //   throw new Error(errorMessage);
  // }
}
