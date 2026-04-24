use std::{collections::HashMap, fs};
use std::{env, process::Command as Proc};
use std::collections::HashSet;

// Commands
pub enum Command {
    Cd(String),
    Run(String),
    Env(String, String),
}

type Tasks = HashMap<String, Task>;

pub struct Task {
    pub deps: Vec<String>,
    pub commands: Vec<Command>,
}


enum VisitState {
    NotVisited,
    Visiting,
    Visited,
}

// To Control Cycles
type StateMap = HashMap<String, VisitState>;

fn detect_cycles(
    tasks: &Tasks,
    name: &str,
    state: &mut HashMap<String, VisitState>,
    stack: &mut Vec<String>,
) {
    match state.get(name).unwrap_or(&VisitState::NotVisited) {
        VisitState::Visiting => {
            // CYCLE FOUND
            let cycle_start = stack.iter()
                .position(|n| n == name)
                .unwrap();

            let cycle = &stack[cycle_start..];

            panic!("❌ Cycle detected: {:?}", cycle);
        }

        VisitState::Visited => return,

        VisitState::NotVisited => {}
    }

    // mark as visiting
    state.insert(name.to_string(), VisitState::Visiting);
    stack.push(name.to_string());

    let task = tasks.get(name)
        .expect("task not found");

    for dep in &task.deps {
        detect_cycles(tasks, dep, state, stack);
    }

    stack.pop();
    state.insert(name.to_string(), VisitState::Visited);
}


// To detect Cycles
pub fn validate(tasks: &Tasks, root: &str) {
    let mut state = HashMap::new();
    let mut stack = vec![];

    detect_cycles(tasks, root, &mut state, &mut stack);
}


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


// Function to parse a Line
fn parse_line(line: &str) -> Option<Command> {
    let line = line.trim();

    if line.starts_with("cd ") {
        return Some(Command::Cd(line[3..].to_string()));
    }

    if line.starts_with("run ") {
        return Some(Command::Run(line[4..].to_string()));
    }

    if line.starts_with("env ") {
        // env KEY=VALUE
        let rest = &line[4..];
        let parts: Vec<&str> = rest.split('=').collect();
        if parts.len() == 2 {
            return Some(Command::Env(
                parts[0].to_string(),
                parts[1].to_string(),
            ));
        }
    }

    None
}


// Function to parse the Header of a Task
fn parse_task_header(line: &str) -> (String, Vec<String>) {
    let parts: Vec<&str> = line.split(':').collect();
    let name = parts[0].trim().to_string();

    let deps = if parts.len() > 1 {
        parts[1]
            .split_whitespace()
            .map(|s| s.to_string())
            .collect()
    } else {
        vec![]
    };

    (name, deps)
}


// Function to Parse the File
pub fn parse(content: &str) -> Tasks {
    let mut tasks = HashMap::new();
    let mut current: Option<String> = None;

    for line in content.lines() {
        let line = line.trim_end();

        if line.trim().is_empty() || line.starts_with('#') {
            continue;
        }

        // task header
        if !line.starts_with(' ') && line.contains(':') {
            let (name, deps) = parse_task_header(line);

            tasks.insert(name.clone(), Task {
                deps,
                commands: vec![],
            });

            current = Some(name);
        }

        // command
        else if line.starts_with(' ') {
            if let Some(task_name) = &current {
                let cmd = parse_line(line).unwrap();

                tasks.get_mut(task_name)
                    .unwrap()
                    .commands
                    .push(cmd);
            }
        }
    }

    tasks
}


// Function to run a Task
pub fn run_task(
    tasks: &Tasks,
    name: &str,
    visited: &mut HashSet<String>,
) {
    if visited.contains(name) {
        return;
    }

    visited.insert(name.to_string());

    let task = tasks.get(name)
        .expect("task not found");

    // 1. run dependencies first
    for dep in &task.deps {
        run_task(tasks, dep, visited);
    }

    println!("\n==> running task: {}\n", name);

    // 2. run commands
    for cmd in &task.commands {
        match cmd {
            Command::Cd(path) => {
                std::env::set_current_dir(path)
                    .expect("cd failed");
            }

            Command::Env(k, v) => {
                unsafe {
                    std::env::set_var(k, v);
                }
            }

            Command::Run(c) => {
                let mut parts = c.split_whitespace();
                let program = parts.next().unwrap();
                let args: Vec<&str> = parts.collect();

                let status = std::process::Command::new(program)
                    .args(args)
                    .status()
                    .expect("failed");

                if !status.success() {
                    panic!("task failed");
                }
            }
        }
    }
}

// // Usage
//
// fn main() {
//     let content = std::fs::read_to_string("Samfile").unwrap();

//     let tasks = parse(&content);

//     let mut visited = std::collections::HashSet::new();

//     let args: Vec<String> = std::env::args().collect();
//     let task = args.get(1).map(|s| s.as_str()).unwrap_or("build");

//     run_task(&tasks, task, &mut visited);
// }
