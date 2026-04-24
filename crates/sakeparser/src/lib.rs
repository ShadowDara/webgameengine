use std::{collections::HashMap, fs};

type Tasks = HashMap<String, Vec<String>>;


// Shell
#[cfg(windows)]
const SHELL: &str = "cmd";

#[cfg(windows)]
const SHELL_SUB: &str = "/C";

// Linux / MacOS

#[cfg(not(windows))]
const SHELL: &str = "sh";

#[cfg(not(windows))]
const SHELL_SUB: &str = "-c";


fn parse_samfile(content: &str) -> Tasks {
    let mut tasks: Tasks = HashMap::new();
    let mut current_task: Option<String> = None;

    for line in content.lines() {
        let line = line.trim_end();

        // ignore empty + comments
        if line.trim().is_empty() || line.trim_start().starts_with('#') {
            continue;
        }

        // new task
        if !line.starts_with([' ', '\t']) && line.ends_with(':') {
            let name = line.trim_end_matches(':').to_string();
            tasks.insert(name.clone(), Vec::new());
            current_task = Some(name);
        }
        // command (indented)
        else if line.starts_with(' ') || line.starts_with('\t') {
            if let Some(task) = &current_task {
                tasks
                    .get_mut(task)
                    .unwrap()
                    .push(line.trim().to_string());
            }
        }
    }

    tasks
}

fn run_task(tasks: &Tasks, name: &str) {
    if let Some(commands) = tasks.get(name) {
        let script = commands.join("\n");

        println!("Running:\n{}", script);

        let status = std::process::Command::new(SHELL)
            .arg(SHELL_SUB)
            .arg(script)
            .status()
            .expect("failed to execute");

        if !status.success() {
            eprintln!("{}Task failed{}", RED, END);
        }
    }
}

// // Usage
//
// fn main() {
//     let content = fs::read_to_string("Samfile")
//         .expect("Could not read Samfile");

//     let tasks = parse_samfile(&content);

//     let args: Vec<String> = std::env::args().collect();
//     let task_name = args.get(1).map(|s| s.as_str()).unwrap_or("build");

//     run_task(&tasks, task_name);
// }
