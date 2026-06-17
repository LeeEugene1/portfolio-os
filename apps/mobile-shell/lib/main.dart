import 'package:flutter/material.dart';

void main() {
  runApp(const PortfolioOsShellApp());
}

class PortfolioOsShellApp extends StatelessWidget {
  const PortfolioOsShellApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Portfolio OS',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
        useMaterial3: true,
      ),
      home: const ShellHome(),
    );
  }
}

class ShellHome extends StatelessWidget {
  const ShellHome({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Portfolio OS'),
      ),
    );
  }
}
