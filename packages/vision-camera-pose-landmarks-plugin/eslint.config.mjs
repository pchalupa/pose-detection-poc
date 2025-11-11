import expoConfig from 'eslint-config-expo/flat';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([globalIgnores(['dist/*']), expoConfig]);
