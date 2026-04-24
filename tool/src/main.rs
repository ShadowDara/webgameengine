use std::env;

use fluaterm::{self, END, GREEN, RED, YELLOW};
use sakeparser::{parse, run_task, validate};
use win_utf8_rs::enable_utf8;

const PROGNAME: &str = "samtool";

fn help() {
    println!(r#"{}
███████╗ █████╗ ███╗   ███╗███████╗███╗   ██╗ ██████╗ ██╗███╗   ██╗███████╗
██╔════╝██╔══██╗████╗ ████║██╔════╝████╗  ██║██╔════╝ ██║████╗  ██║██╔════╝
███████╗███████║██╔████╔██║█████╗  ██╔██╗ ██║██║  ███╗██║██╔██╗ ██║█████╗  
╚════██║██╔══██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║██║   ██║██║██║╚██╗██║██╔══╝  
███████║██║  ██║██║ ╚═╝ ██║███████╗██║ ╚████║╚██████╔╝██║██║ ╚████║███████╗
╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝{}
                   
=== Help Menu ===

{}samfile{}:
    This is a file which can be created in the .samengine directory, it
    works a bit simmilliar to makefile and can used to make the build
    process easier.
    
    Execute commands or scripts from it by running {} build, to run the
    build script.
    
    PS: The File is named {}samfile{}"#, RED, END, GREEN, END, PROGNAME, YELLOW, END)
}

// Run sth from the samfile
fn run_sam_file(command: &str) {
    let content = match std::fs::read_to_string("samfile") {
        Ok(c) => c,
        Err(e) => {
            eprintln!("Error while reading samfile: {}", e);
            return;
        }
    };

    let tasks = parse(&content);

    // Check for cycled dependencies
    validate(&tasks, command);

    // Map which one was already visited
    let mut visited = std::collections::HashSet::new();

    // Execute the Task
    run_task(&tasks, command, &mut visited);
}

// Main function
fn main() {
    #[cfg(windows)]
    let _ = enable_utf8();

    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        eprintln!("{}{}: No Argument Provided{}", RED, PROGNAME, END);
        return;
    }

    let first_arg = &args[1];

    match first_arg.as_str() {
        // Print Help
        "help" => {
            help()
        }

        // When not found
        _ => {
            run_sam_file(first_arg);
        }
    }
}
