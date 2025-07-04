console.log("✅ background.js loaded");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LOGIN_REQUEST") {
    const { url, username, password } = message;

    const graphqlQuery = {
      query: `
        mutation LoginUser {
          login(input: {
            clientMutationId: "client1",
            username: "${username}",
            password: "${password}"
          }) {
            authToken
            refreshToken
            user {
              id
              userId
              name
              onboardingStatus
              companyId
            }
          }
        }
      `,
      variables: {}
    };

    console.log("🌐 Sending login request to:", url);
    console.log("📨 Payload:", graphqlQuery);

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphqlQuery)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.errors) {
          console.error("🛑 GraphQL login error:", data.errors);
        } else {
          console.log("✅ GraphQL login data:", data);
        }
        sendResponse({ success: true, data });
      })

    return true;
  }
});
