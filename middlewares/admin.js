export function authorizeAdmin(req, res, next) {
  if (!global.user) {
    return next({
      status: 401,
      message: "Du måste vara inloggad för att komma åt denna route"
    });
  }

  
  if (global.user.role !== "admin") {
    return next({
      status: 403,
      message: "Endast admin-användare kan komma åt denna funktionalitet"
    });
  }

  
  next();
}
