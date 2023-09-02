import payload from "payload"
const EMAIL = process.env.TECH_SUPPORT_EMAIL
const ENVIRON = process.env.ENVIRON

const EVENT_LEVELS = {
    minor: "minor",
    medium: "medium",
    major: "major",
    critical: "critical"
}

const reportIssue = ({ msg, level, trace, code }) => {
    if(ENVIRON == "local") return // don't report local issues 
    try {
        const reportEmailHtml = `
        <!doctype html>
        <html>
        <style>
        h1   {font-weight: 700;}
        button   {background-color: #AC3633;color:#ffff; font-weight: 600; padding: 1em; border: 0; border-radius:10px;}
        </style>
        <body>
        <h3>Hello, issue to report</h3>
            <p>System: Portal</p>
            <p>Environment: ${ENVIRON}</p>
            <p>Level: ${level}</p>
            <p>Message: ${msg} </p>
            <p>Code: ${code} </p>
            <pre>Trace: ${trace} </pre>
        </body>
        </html>
        `


        var email = {
            from: "contact@redcurry.co",
            to: EMAIL,
            subject: "Issue report from Portal, " + ENVIRON,
            html: reportEmailHtml
        }
        payload.sendEmail(email)
    } catch (error) {
        console.log("reportIssue | error: ", error)
    }
}




export { reportIssue, EVENT_LEVELS }