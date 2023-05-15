// Set up your project here
const author = 'keneanung';  // author name on GitHub, might also be an org
const projectName = 'nexus-misc-packages'; // project name on GitHub
const libraryName = 'MiscPackages'; // name of the resulting library. Used by webpack to create a global name
const npmAuthorName = 'keneanung'; // name of the author for NPM
const npmPackageName = 'nexus-misc-packages'; // Name of the NPM package that should be published
const projectDescription = 'A collection of smaller packages for Nexus 3'; // Project description in the NPM package
const authorEmail = 'keneanung@gmail.com' // author email address
const docuTitle = 'Small Neuxs Packages'; // Title of the documentation website
const docuTagline = 'A collection of smaller packages for Nexus 3'; // Used for documentation website


// don't modify the exports below (except to add new fields)
module.exports = {
    author,
    projectName,
    githubRepoWebUrl: `https://github.com/${author}/${projectName}`,
    githubRepoGitUrl: `git://github.com/${author}/${projectName}.git`,
    libraryName,
    npmPackageName: `@${npmAuthorName}/${npmPackageName}`,
    projectDescription,
    authorEmail,
    docuTitle,
    docuTagline,
}
