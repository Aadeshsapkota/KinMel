import * as signalR from "@microsoft/signalr";

export async function connectToTicket(
  ticketId: number,
  onMessage: (message: any) => void
): Promise<signalR.HubConnection> {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5134/supportHub")
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveMessage", (message) => {
    onMessage(message);
  });

  try {
    await connection.start();
    await connection.invoke("JoinTicket", ticketId.toString());
  } catch (error) {
    console.error("SignalR Connection Error: ", error);
  }

  return connection;
}

export async function disconnectFromTicket(
  connection: signalR.HubConnection | null,
  ticketId: number
) {
  if (!connection) return;

  try {
    if (connection.state === signalR.HubConnectionState.Connected) {
      await connection.invoke("LeaveTicket", ticketId.toString());
    }
    await connection.stop();
  } catch (error) {
    console.error("SignalR Disconnect Error: ", error);
  }
}
