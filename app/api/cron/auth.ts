// export const dynamic = 'force-dynamic'; // static by default, unless reading the request
 
export function GET(request: Request) {
    process.env.TEST = "nope"
  return new Response(`Hello from ${process.env.TEST}`);
}

// // async function authenticateSpotify() {
// //   const url = 'https://accounts.spotify.com/api/token';
// //   const headers = {
// //     'Authorization': 'Basic ' + btoa(process.env.client_id + ':' + process.env.client_secret),
// //     'Content-Type': 'application/x-www-form-urlencoded'
// //   };

// //   const body = new URLSearchParams();
// //   body.append('grant_type', 'client_credentials');
// //   try {
// //     const response = await fetch(url, {
// //       method: 'POST',
// //       headers: headers,
// //       body: body,
// //     });

// //     if(!response.ok) {
// //       throw new Error(`Error in Auth response: ${response.statusText}`);
// //     }

// //     const data = await response.json();
// //     token = data.access_token;
// //     console.log("Token", token);
// //     console.log("Toklen expires in: data.expires_in");
// //     } catch(error) {
// //       console.error('Error ', error);
// //     }
// // }