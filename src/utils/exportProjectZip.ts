import JSZip from 'jszip';
import { JAVA_PROJECT_FILES } from '../data/javaCodebase';

export async function generateAndroidProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file('build.gradle', `// Top-level build file
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath "com.android.tools.build:gradle:8.2.2"
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`);

  zip.file('settings.gradle', `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "SmartPantryManager"
include ':app'
`);

  zip.file('gradle.properties', `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
`);

  // Include all defined Java and XML files
  for (const file of JAVA_PROJECT_FILES) {
    zip.file(file.path, file.code);
  }

  // Include strings.xml, colors.xml, and themes.xml
  zip.file('app/src/main/res/values/strings.xml', `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Smart Pantry Manager</string>
    <string name="menu_pantry">Pantry</string>
    <string name="menu_recipes">Recipes</string>
    <string name="menu_settings">Settings</string>
    <string name="empty_pantry_msg">Your pantry is empty. Tap + to add leftovers!</string>
    <string name="empty_recipes_msg">No recipes match your pantry yet. Add more ingredients!</string>
</resources>
`);

  zip.file('app/src/main/res/values/colors.xml', `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="primary">#1E3A8A</color>
    <color name="primary_dark">#172554</color>
    <color name="accent">#059669</color>
    <color name="background_light">#F8FAFC</color>
    <color name="surface_card">#FFFFFF</color>
    <color name="text_primary">#0F172A</color>
    <color name="text_secondary">#64748B</color>
    <color name="warning_orange">#EA580C</color>
    <color name="danger_red">#DC2626</color>
</resources>
`);

  return await zip.generateAsync({ type: 'blob' });
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
