// ✅ src/services/auth.js
const API_BASE = "https://68625e2196f0cc4e34b96cf1.mockapi.io/api/test";

export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE}/user`);
    const users = await res.json();

    const matchedUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (!matchedUser) throw new Error("Invalid credentials");

    const accessToken = "fake-access-token";
    const refreshToken = "fake-refresh-token";

    // Store user data and wait for completion
    const storeUserData = () => new Promise((resolve) => {
      if (typeof window !== "undefined" && window.chrome?.storage?.local) {
        window.chrome.storage.local.set({ accessToken, refreshToken, user: matchedUser }, () => {
          console.log("User data stored in Chrome storage");
          resolve();
        });
      } else {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(matchedUser));
        console.log("User data stored in localStorage");
        resolve();
      }
    });

    await storeUserData();
    console.log("Login successful, user:", matchedUser);
    return { success: true, user: matchedUser };
  } catch (error) {
    console.error("Login error:", error.message);
    return { success: false, message: error.message };
  }
};

export const fetchTasks = async () => {
  try {
    console.log("🔍 Starting fetchTasks...");
    
    const getUser = () =>
      new Promise((resolve) => {
        if (typeof window !== "undefined" && window.chrome?.storage?.local) {
          window.chrome.storage.local.get("user", (result) => {
            console.log("📦 Chrome storage user:", result.user);
            resolve(result.user || null);
          });
        } else {
          const userStr = localStorage.getItem("user");
          console.log("💾 LocalStorage user string:", userStr);
          try {
            const user = userStr ? JSON.parse(userStr) : null;
            console.log("💾 Parsed localStorage user:", user);
            resolve(user);
          } catch (error) { 
            console.error("❌ Error parsing user from localStorage:", error);
            resolve(null);
          }
        }
      });

    const user = await getUser();
    console.log("👤 Current user for task fetch:", user);
    
    if (!user) {
      console.log("❌ No user found, returning empty tasks");
      return [];
    }

    if (!user.userId) {
      console.log("❌ User has no ID, returning empty tasks. User object:", user);
      return [];
    }

    console.log(`🌐 Fetching tasks from API: ${API_BASE}/task`);
    const res = await fetch(`${API_BASE}/task`);
    
    if (!res.ok) {
      throw new Error(`Failed to fetch tasks: ${res.status} ${res.statusText}`);
    }
    
    const allTasks = await res.json();
    console.log("📋 All tasks from API:", allTasks);
    console.log("📋 Number of tasks from API:", allTasks.length);

    if (!Array.isArray(allTasks)) {
      console.error("❌ API did not return an array. Received:", typeof allTasks, allTasks);
      return [];
    }

    // Convert both IDs to strings for comparison
    const userId = user.Id.toString();
    console.log(`🔍 Looking for tasks with userId: "${userId}"`);
    
    const userTasks = allTasks.filter((task, index) => {
      const taskUserId = task.userId ? task.userId.toString() : '';
      const matches = taskUserId === userId;
      console.log(`📋 Task ${index}: userId="${taskUserId}", matches=${matches}`, task);
      return matches;
    });

    console.log("✅ Filtered user tasks:", userTasks);
    console.log("✅ Number of user tasks:", userTasks.length);
    return userTasks;
  } catch (error) {
    console.error("❌ Error fetching tasks:", error);
    console.error("❌ Error details:", error.message, error.stack);
    return [];
  }
};

export const logoutUser = () => {
  if (typeof chrome !== "undefined" && chrome?.storage?.local) {
    chrome.storage.local.remove(['accessToken', 'refreshToken', 'user', 'task']);
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('task');
  }
  console.log("User logged out successfully");
};