// ✅ src/services/timerService.js (with logging for attendance debug)

export const fetchAttendance = async () => {
  try {
    const storage = await new Promise((resolve) => {
      chrome.storage.local.get(['accessToken', 'apiBase', 'user'], (result) => {
        resolve(result);
      });
    });

    const { accessToken, apiBase, user } = storage;

    if (!accessToken || !apiBase || !user?.userId) {
      console.warn('❌ Missing auth or user data');
      return null;
    }

    console.log('🔑 Access Token:', accessToken);
    console.log('🌐 API Base:', apiBase);
    console.log('👤 User:', user);

    const query = {
      query: `
        query {
          getAttendanceRecords {
            id
            check_in_time
            check_out_time
            last_activity_type
            total_break
            break_logs {
              break_start_time
              break_end_time
            }
            created_at
            updated_at
          }
        }
      `,
      variables: {}
    };

    const res = await fetch(apiBase, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });

    console.log('📡 Attendance API response:', res);

    if (!res.ok) {
      console.error(`❌ Attendance fetch failed: HTTP ${res.status}`);
      return null;
    }

    const json = await res.json();
    console.log('📥 Parsed Attendance JSON:', json);

    return json?.data?.getAttendanceRecords?.[0] || null;
  } catch (err) {
    console.error('❌ fetchAttendance error:', err);
    return null;
  }
};

export const updateAttendance = async (actionType, currentAttendance) => {
  try {
    const storage = await new Promise((resolve) => {
      chrome.storage.local.get(['accessToken', 'apiBase'], (result) => {
        resolve(result);
      });
    });

    const { accessToken, apiBase } = storage;

    const input = {};
    const attId = currentAttendance?.id;

    switch (actionType) {
      case 'checkin':
        input.check_in_time = true;
        break;
      case 'break':
        input.attendance_id = attId;
        input.break_time_start = true;
        break;
      case 'back':
        input.attendance_id = attId;
        input.break_time_end = true;
        break;
      case 'checkout':
        input.attendance_id = attId;
        input.check_out_time = true;
        break;
    }

    const mutation = {
      query: `
        mutation UpdateAttendance($input: UpdateAttendanceInput!) {
          updateAttendance(input: $input) {
            success
            message
            id
            last_activity_type
          }
        }
      `,
      variables: { input },
    };

    const res = await fetch(apiBase, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mutation),
    });

    const json = await res.json();
    console.log('✅ updateAttendance response:', json);
    return json?.data?.updateAttendance || { success: false };
  } catch (err) {
    console.error('❌ updateAttendance error:', err);
    return { success: false };
  }
};
