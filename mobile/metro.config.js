const path = require('path');
const { withNativewind } = require('nativewind/metro');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const sharedRoot = path.resolve(projectRoot, '../shared');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// 1. Monitorizează modificările fișierelor din folderul ../shared
config.watchFolders = [sharedRoot];

// 2. Asigură că pachetele din node_modules sunt rezolvate corect din folderul mobile
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// 3. Rezolvă alias-ul @shared către folderul fizic
config.resolver.extraNodeModules = {
  '@shared': sharedRoot,
};

// Păstrează configurarea NativeWind (inclusiv opțiunile tale existente, ex: { input: './global.css' } dacă ai)
module.exports = withNativewind(config);
