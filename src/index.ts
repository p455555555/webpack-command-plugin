import { spawn, exec, ChildProcess, ExecException } from 'child_process';
import { platform } from 'os';
import { Compiler } from 'webpack';

interface Option<T> {
    onBuildStart?: T;
    onBuildEnd?: T;
    onBuildExit?: T;
    dev?: boolean;
    verbose?: boolean;
    safe?: boolean;
}

export default class WebpackCommandPlugin {
    protected options: Option<string[]> = {
        onBuildStart: [],
        onBuildEnd: [],
        onBuildExit: [],
        dev: true,
        safe: false
    };
    constructor(options: Option<string>){
        this.validateInput(options);
    }

    /**
     * 处理传入参数
     * @param options
     */
    private validateInput(options: Option<string>){
        if (options.onBuildStart) {
            this.options.onBuildStart = options.onBuildStart.split('&&');
        }
        if (options.onBuildEnd) {
            this.options.onBuildEnd = options.onBuildEnd.split('&&');
        }
        if (options.onBuildExit) {
            this.options.onBuildExit = options.onBuildExit.split('&&');
        }
        if (options.dev) {
            this.options.dev = options.dev;
        }
        if (options.safe) {
            this.options.safe = options.safe;
        }
    }

    /**
     * webpack 钩子函数
     * @param compiler 
     */
    public apply(compiler: Compiler) {

        // 编译(compilation)创建之后
        compiler.hooks.compilation.tap('WebpackShellPlugin', () => {
            if (this.options.onBuildStart && this.options.onBuildStart.length) {
                this.runCommands(this.options.onBuildStart);
                if (this.options.dev) {
                    this.options.onBuildStart = [];
                }
            }
        });

        // 生成资源到 output 目录之后
        compiler.hooks.afterEmit.tapAsync('WebpackShellPlugin', (_compilation, callback) => {
            if (this.options.onBuildEnd && this.options.onBuildEnd.length) {
                this.runCommands(this.options.onBuildEnd);
                if (this.options.dev) {
                    this.options.onBuildEnd = [];
                }
            }
            callback();
        });

        // 编译(compilation)完成。
        compiler.hooks.done.tap('WebpackShellPlugin', () => {
            if (this.options.onBuildExit && this.options.onBuildExit.length) {
                this.runCommands(this.options.onBuildExit);
            }
        });
    }

    /**
     * 执行shell
     * @param commands 
     */
    private runCommands(commands: string[]) {
        for (const item of commands) {
            if (platform() === 'win32' || this.options.safe) {
                this.spreadStdoutAndStdErr(exec(item, this.throwError));
            } else {
                const { command, args } = this.serializeScript(item);
                const proc = spawn(command, args, {stdio: 'inherit'});
                proc.on('close', this.throwError);
            }
        }
    }

    /**
     * 处理spawn方法参数
     * @param script
     */
    private serializeScript(script: string) {
        const [ command, ...args ] = script.split(' ');

        return { command, args };
    }

    /**
     * 向主进程输出结果
     * @param proc 
     */
    private spreadStdoutAndStdErr(proc: ChildProcess) {
        if (proc && proc.stdout && proc.stderr) {
            proc.stdout.pipe(process.stdout);
            proc.stderr.pipe(process.stdout);  
        }
    }

    /**
     * 错误处理
     * @param error 
     */
    private throwError(error: ExecException) {
        if (error) {
          throw error;
        }
    }
}