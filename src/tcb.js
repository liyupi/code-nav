import cloudbase from "@cloudbase/js-sdk";

// 将你的环境 Id 填写到此处
export const envId = 'your-envId';

let app = cloudbase.init({
  env: envId,
});

let auth = app.auth({
  persistence: "local",
});

export async function tcbLogin() {
  // 1. 建议登录前先判断当前是否已经登录
  const loginState = await auth.getLoginState();
  console.log(loginState)
  if(!loginState){
    // 2. 匿名登录
    await auth.anonymousAuthProvider().signIn();
    const loginState = await auth.getLoginState();
    console.log(loginState);
  }
}

export const getApp = () => {
  return app;
}
