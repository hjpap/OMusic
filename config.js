/**
 * Created by wei.wang on 11/4/13.
 */
exports.config = {
    siteInfo:{
        siteURL:"http://localhost:3001",
        siteStaticURL:"http://localhost:3001",
        title:"OMusic.",
        description:"Wei's Blog",
        keywords:"music"
    },
    session_secret:"ricw",
    session_maxAge:30000,

    db: 'mongodb://localhost/OMusic'

}
