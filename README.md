# Entropy Analyzer

This project is an Entropy Analyzer that can be used to measure the randomness of data.

## Development

To start development mode, follow these steps:

1. Clone the repository:

```sh
    git clone https://github.com/kpyszkowski/entropy.git
```

2. Install dependencies:

```sh
    npm install
```

3. Start development mode:

```sh
    npm start
```

NOTE: By default the development mode runs with the [sample data](./data) and with the depth of 2. You can adjust it by editing execution script located in `package.json` file.

## Compilation

To compile the project, follow these steps:

1. Compile the project:

```sh
    npm run compile
```

2. The executable file will be located in the project root.

NOTE: Cross platform compilation is not supported so it needs to be compiled on the host machine or at least on the machine with the same CPU architecture nor operating system.

## Usage

To use the executable, follow these steps:

0. For more details and instructions check the help note:

```sh
    ./entropy-analyzer -h
```

1. Run the executable:

```sh
./entropy-analyzer --data=<data-directory-path> --depth=<conditional-entropy-depth>
```

Sample data have been [provided](./data) with the repository.
