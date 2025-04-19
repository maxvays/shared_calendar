import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [groups, setGroups] = useState<any[] | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${apiBase}/users`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const handleLogin = async (userId: string) => {
    setCurrentUserId(userId);
    setGroups(null);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/groups/user/${userId}`);
      const data = await res.json();
      setGroups(data);
    } catch (err: any) {
      setError("Failed to fetch groups.");
    }
  };

  const handleCreateGroup = async () => {
    setError(null);
    try {
      const res = await fetch(`${apiBase}/groups`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: newGroupName,
            createdBy: currentUserId,
            memberIds: selectedMembers,
          }),
          
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create group");
      setGroups((prev) => (prev ? [...prev, data] : [data]));
      setNewGroupName("");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return;
  
    try {
      const res = await fetch(`${apiBase}/groups/${groupId}?userId=${currentUserId}`, {
        method: "DELETE",
      });
  
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete group");
      }
  
      setGroups((prev) => prev?.filter((g) => g.id !== groupId) || []);
    } catch (err: any) {
      setError(err.message);
    }
  };
  

  return (
    <div className="container">
      <h1>Shared Calendar</h1>

      <label>
        <strong>Select user to log in:</strong>
        <select
          value={currentUserId}
          onChange={(e) => handleLogin(e.target.value)}
        >
          <option value="">-- Choose a user --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>
      </label>

      {currentUserId && (
        <>
          <p style={{ marginTop: "1rem" }}>
            ✅ Logged in as{" "}
            <strong>
              {users.find((u) => u.id === currentUserId)?.name || "Unknown"}
            </strong>
          </p>

          <div style={{ marginTop: "2rem" }}>
  <h2>Create a Group</h2>
  <input
    type="text"
    placeholder="Group name"
    value={newGroupName}
    onChange={(e) => setNewGroupName(e.target.value)}
    style={{ display: "block", marginBottom: "1rem", width: "100%" }}
  />

  <label><strong>Select group members:</strong></label>
  <select
    multiple
    size={users.length}
    style={{ width: "100%", marginBottom: "1rem" }}
    onChange={(e) =>
      setSelectedMembers(Array.from(e.target.selectedOptions, (opt) => opt.value))
    }
  >
    {users
      .filter((u) => u.id !== currentUserId) // exclude the current user
      .map((u) => (
        <option key={u.id} value={u.id}>
          {u.name} ({u.email})
        </option>
      ))}
  </select>

  <button onClick={handleCreateGroup}>Create</button>
</div>


          <div style={{ marginTop: "2rem" }}>
            <h2>Groups</h2>
            {groups && groups.length > 0 ? (
              <ul>
                {groups.map((group) => (
                  <li key={group.id} style={{ marginBottom: "1rem" }}>
                  <strong>{group.name}</strong> — {group.members?.length || 0} members
                  {group.createdBy === currentUserId && (
                    <>
                      {" "}
                      <button
                        onClick={() => handleDeleteGroup(group.id)}
                        style={{
                          marginLeft: "1rem",
                          background: "red",
                          color: "white",
                          border: "none",
                          padding: "0.3rem 0.6rem",
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </li>
                
                ))}
              </ul>
            ) : (
              <p>No groups yet.</p>
            )}
          </div>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
