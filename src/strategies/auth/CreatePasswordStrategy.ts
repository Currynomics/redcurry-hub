export default {
  generateEmailHTML: ({ req, token, user }) => {
    const createPasswordURL = process.env.APP_AUTH_URL + `#/password?name=${user.firstName}&token=${token}`;

    return `
        <!doctype html>
        <html>
          <style>
          h1   {font-weight: 700;}
          button   {background-color: #AC3633;color:#ffff; font-weight: 600; padding: 1em; border: 0; border-radius:10px;}
          </style>
          <body>
          <h3>Hello ${user.firstName}</h3>
            <p>Follow the link below to</p>
            <p>1. Create a password.</p>
            <p>2. Log in.</p>
            <p>3. Write down the secret words provided (shown only once).</p>
            <p>4. Go to admin application.</p>

            <a href="${createPasswordURL}" target="_blank">
                <button>Create password</button>
            </a>
            <p>NB! Use Chrome browser.</p>
          </body>
        </html>
      `;
  }
}