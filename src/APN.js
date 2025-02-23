let handleNotification;
const handlePermission = (callback) => {
    handleNotification = callback

    if (window.safari && window.safari.pushNotification) {
        let result = window.safari.pushNotification.permission("web.com.admin.goagalia")

        checkPermission(result)

    }


};

const checkPermission = (permissionData) => {

    if (permissionData.permission === "default") {
        window.safari.pushNotification.requestPermission(process.env.REACT_APP_API_ENDPOINT.split('/api')[0], "web.com.admin.goagalia", { panel: "admin" }, checkPermission)
    }
    else if (permissionData.permission === "denied") {
        console.log("denied")
    }
    else if (permissionData.permission === "granted") {

        handleNotification(permissionData.deviceToken)
    }
}


export { handlePermission };