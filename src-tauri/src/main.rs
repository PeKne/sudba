// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
use std::fs;

fn main() {
  let quit_option = CustomMenuItem::new("app:quit".to_string(), "Ukončit");

  // TODO: add new file
  let save_option = CustomMenuItem::new("file:save".to_string(), "Uložit").accelerator("CmdOrCtrl+S");
  let load_option = CustomMenuItem::new("file:load".to_string(), "Otevřít").accelerator("CmdOrCtrl+O");
  let app_submenu = Submenu::new("Sudba", Menu::new().add_item(quit_option));
  let file_submenu = Submenu::new("Soubor", Menu::new().add_item(save_option).add_item(load_option));
  let menu = Menu::new()
    .add_native_item(MenuItem::Copy)
    .add_submenu(app_submenu)
    .add_submenu(file_submenu);

  tauri::Builder::default()
      .menu(menu)
      .on_menu_event(|event| match event.menu_item_id() {
        "app:quit" => {
          event.window().emit("app:quit", "").unwrap();
        }
        "file:load" => {
            event.window().emit("file:load-file", "").unwrap();
        }
        "file:save" => {
            event.window().emit("file:save-file", "").unwrap();
        }
        _ => {}
    })
      .invoke_handler(tauri::generate_handler![save_file])
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}

#[tauri::command]
fn save_file(path: String, contents: String) {
  fs::write(path, contents).unwrap();
}