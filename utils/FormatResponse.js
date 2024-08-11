const responseFormatter = ({ error = false, message = '', data = null }) => {
    return {
        error,
        message,
        data: data || undefined, // If data is null or undefined, omit the key
    };
};

module.exports = responseFormatter;
