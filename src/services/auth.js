// ✅ Updated fetchTasks using GraphQL query

export const getApiBase = () =>
  new Promise((resolve) => {
    if (typeof window !== "undefined" && window.chrome?.storage?.local) {
      chrome.storage.local.get("apiBase", (result) => {
        resolve(result.apiBase || "");
      });
    } else {
      resolve("");
    }
  });

export const loginUser = async (email, password, siteUrl) => {
  const url = `${siteUrl}/api/v1`;

  return new Promise((resolve) => {
    if (chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage(
        {
          type: "LOGIN_REQUEST",
          url,
          username: email,
          password: password,
        },
        (response) => {
          console.log("📦 Login response:", response);

          if (chrome.runtime.lastError) {
            console.error("❌ Runtime error:", chrome.runtime.lastError.message);
            return resolve({
              success: false,
              message: "Runtime error: " + chrome.runtime.lastError.message,
            });
          }

          const loginData = response?.data?.data?.login;

          if (response?.success && loginData) {
            const { authToken, refreshToken, user } = loginData;

            chrome.storage.local.set(
              { accessToken: authToken, refreshToken, user, apiBase: url },
              () => {
                console.log("✅ Login data stored");
                resolve({ success: true, user });
              }
            );
          } else {
            console.error("❌ Invalid login response structure:", response);
            resolve({
              success: false,
              message: response?.error || "Login failed",
            });
          }
        }
      );
    } else {
      resolve({ success: false, message: "Chrome runtime not available" });
    }
  });
};

export const fetchTasks = async () => {
  try {
    const storageData = await new Promise((resolve) => {
      if (typeof window !== "undefined" && window.chrome?.storage?.local) {
        chrome.storage.local.get(["user", "accessToken", "apiBase"], (result) => {
          resolve(result);
        });
      } else {
        resolve({});
      }
    });

    const { user, accessToken, apiBase } = storageData;

    if (!user?.userId || !accessToken || !apiBase) {
      console.warn("❌ Missing user ID, token, or apiBase");
      return [];
    }

    const graphqlQuery = {
      query: `{
        projectTasks(where: {assignedTo: ${user.userId}}, first: 1000) {
          nodes {
            id
            projectTaskId
            title
            content
            taskFields {
              dueDate
              estimate
              startDate
              taskFiles {
                taskFile {
                  node {
                    id
                    mediaItemId
                    mediaItemUrl
                    sourceUrl
                  }
                }
              }
              assignedTo {
                nodes {
                  id
                  userId
                  firstName
                  lastName
                  profileImage
                }
              }
              taskLogs {
                logId
                startTime
                endTime
                trackedTime
                lastActivityType
                logDescription
                userDetails {
                  nodes {
                    firstName
                    lastName
                    profileImage
                    userId
                  }
                }
              }
              relatedMilestones {
                nodes {
                  id
                  slug
                  ... on ProjectMilestone {
                    id
                    title
                  }
                }
              }
            }
            taskStatues {
              nodes {
                id
                name
                description
              }
            }
            taskTags {
              nodes {
                id
                name
                description
              }
            }
          }
          pageInfo {
            endCursor
            hasNextPage
            hasPreviousPage
            startCursor
          }
        }
      }`,
      variables: {}
    };

    const response = await fetch(`${apiBase}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    const tasks = json?.data?.projectTasks?.nodes || [];

    // 🛠 Patch each task to ensure taskName exists for search compatibility
    const patchedTasks = tasks.map((task) => ({
      ...task,
      taskName: task.title || '',
      projectName: task.taskFields?.relatedMilestones?.nodes?.[0]?.title || 'Untitled Project',
      projectCode: `PRJ-${task.projectTaskId || task.id}`,
      projectColor: 'bg-purple-300',

    }));

    console.log("📥 GraphQL Tasks received:", patchedTasks);
    return patchedTasks;
  } catch (err) {
    console.error("❌ Error fetching tasks:", err);
    return [];
  }
};

export const logoutUser = () => {
  chrome.storage.local.remove(
    ["accessToken", "refreshToken", "user", "apiBase"],
    () => {
      console.log("✅ Logged out - storage cleared");
    }
  );
};

export const checkAuthStatus = () => {
  return new Promise((resolve) => {
    chrome.storage.local.get(["accessToken", "user"], (result) => {
      const isAuthenticated = !!(result.accessToken && result.user);
      resolve({
        isAuthenticated,
        user: result.user || null,
        accessToken: result.accessToken || null,
      });
    });
  });
};
