import {
  Account,
  Client,
  Databases,
  ExecutionMethod,
  Functions,
  Storage,
} from "appwrite";

export const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1").setProject("conquer-matrix");
export const databases = new Databases(client);
export const functions = new Functions(client);
export const account = new Account(client);
export const storage = new Storage(client);

export const originDatabase = "66e56c8c00229d26bc0d";

export const collections: { [key: string]: string } = {
  recurringTasks: "66e56c9a00298496aace",
  rT_Checklists: "66eab0c7002cc9dc3aef",

  jobs: "66eaf2630005b95dd513",
  habits: "66eaefba002bd30ed010",

  pillars: "66ea8935003aa0f655c6",
  projects: "66eaf16300039018d00c",

  plants: "673ded74002fdc9551c1",

  customSystems: "670e89aa0015e2158983",
  customDocs: "670e8bc700329327e6f4",

  users: "66ea8a890007602932f1",

  archive: "67207a3c000d14c65e1e",
};

export const updateArrayFuncId = "66fe90a70039c9ed4331";
export const queryUsersFuncId = "670ace44001da5355584";

export async function createUsernamePasswordSession(
  username: string,
  password: string
) {
  try {
    const response = await functions.createExecution(
      queryUsersFuncId,
      JSON.stringify({
        username: username,
        password: password,
      }),
      false,
      "/username-login",
      ExecutionMethod.POST
    );
    // console.log("Function response:", response);

    const responseJson = JSON.parse(response.responseBody);

    if (responseJson && responseJson.email) {
      await account.createEmailPasswordSession(responseJson.email, password);
      await account.deleteSession(responseJson.sessionId);
    }
  } catch (error) {
    console.error("Error calling function:", error);
  }
}

export async function checkUsername(username: string) {
  try {
    const response = await functions.createExecution(
      queryUsersFuncId,
      JSON.stringify({
        username: username,
      }),
      false,
      "/check-username",
      ExecutionMethod.GET
    );
    // console.log("Function response:", response);

    const responseJson = JSON.parse(response.responseBody);

    if (responseJson && responseJson.message) {
      return responseJson.message;
    }
  } catch (error) {
    console.error("Error calling function:", error);
  }
}

export async function toggleNumber(
  collectionId: string,
  documentId: string,
  field: string,
  number: number
) {
  try {
    const jwt = await account.createJWT();

    const response = await functions.createExecution(
      updateArrayFuncId,
      JSON.stringify({
        jwt: jwt.jwt,
        collectionId,
        documentId,
        field,
        number,
      }),
      false,
      "/",
      ExecutionMethod.POST
    );
    console.log("Function response:", response);

    const responseJson = JSON.parse(response.responseBody)?.updatedDocument;
    console.log(responseJson);
  } catch (error) {
    console.error("Error calling function:", error);
  }
}
