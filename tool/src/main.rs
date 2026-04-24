use std::env;

use fluaterm::{self, END, RED};
use sakeparser::{parse, run_task};

const PROGNAME: &str = "samtool";

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

    let mut visited = std::collections::HashSet::new();

    run_task(&tasks, command, &mut visited);
}

// Main function
fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        eprintln!("{}{}: No Argument Provided{}", RED, PROGNAME, END);
        return;
    }

    let first_arg = &args[1];
    run_sam_file(first_arg);
}
