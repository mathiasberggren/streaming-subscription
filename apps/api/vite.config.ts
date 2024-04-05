import { ConfigEnv, defineConfig,  } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ command, mode }: ConfigEnv) => {
  return {
    base: '/api',
    server: {
      // vite server configs, for details see \[vite doc\](https://vitejs.dev/config/#server-host)
      port: 3000
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
    optimizeDeps: {
      // Vite does not work well with optional dependencies, mark them as ignored for now
      exclude: [
        '@nestjs/platform-socket.io',
        '@nestjs/websockets',
        '@nestjs/microservices',
        'amqp-connection-manager',
        'amqplib',
        'nats',
        '@grpc/proto-loader',
        '@grpc/grpc-js',
        'redis',
        'kafkajs',
        'mqtt',
        'cache-manager',
      ],
    },
    plugins: [
      tsconfigPaths(),
      ...VitePluginNode({
        adapter: 'nest',
        appPath: './src/main.ts',
        tsCompiler: 'swc',
      }),
    ],
  };
});
