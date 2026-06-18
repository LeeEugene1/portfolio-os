import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:webview_flutter/webview_flutter.dart';

void main() {
  runApp(const PortfolioOsShellApp());
}

typedef WebViewBuilder = Widget Function(WebViewController controller);

const String defaultPortfolioUrl = 'https://web-six-chi-49.vercel.app';

class PortfolioOsShellApp extends StatelessWidget {
  const PortfolioOsShellApp({super.key, this.webViewBuilder});

  final WebViewBuilder? webViewBuilder;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Portfolio OS',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2563EB)),
        useMaterial3: true,
      ),
      home: ShellHome(webViewBuilder: webViewBuilder),
    );
  }
}

class ShellHome extends StatefulWidget {
  const ShellHome({super.key, this.webViewBuilder});

  final WebViewBuilder? webViewBuilder;

  @override
  State<ShellHome> createState() => _ShellHomeState();
}

class _ShellHomeState extends State<ShellHome> {
  static final Uri _homeUri = Uri.parse(
    String.fromEnvironment(
      'PORTFOLIO_OS_URL',
      defaultValue: defaultPortfolioUrl,
    ),
  );

  late final WebViewController _controller;
  var _loadingProgress = 0;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();

    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFFF8FAFC))
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (progress) {
            if (!mounted) return;
            setState(() {
              _loadingProgress = progress;
            });
          },
          onPageStarted: (_) {
            if (!mounted) return;
            setState(() {
              _errorMessage = null;
              _loadingProgress = 0;
            });
          },
          onPageFinished: (_) {
            if (!mounted) return;
            setState(() {
              _loadingProgress = 100;
            });
          },
          onWebResourceError: (error) {
            if (error.isForMainFrame == false || !mounted) return;
            setState(() {
              _errorMessage = error.description;
            });
          },
          onNavigationRequest: _handleNavigationRequest,
        ),
      )
      ..loadRequest(_homeUri);
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
        if (await _controller.canGoBack()) {
          await _controller.goBack();
          return;
        }
        await SystemNavigator.pop();
      },
      child: Scaffold(
        body: SafeArea(
          child: Stack(
            children: [
              Positioned.fill(
                child: widget.webViewBuilder?.call(_controller) ??
                    WebViewWidget(controller: _controller),
              ),
              if (_loadingProgress < 100 && _errorMessage == null)
                LinearProgressIndicator(value: _loadingProgress / 100),
              if (_errorMessage != null)
                _LoadError(
                  message: _errorMessage!,
                  onRetry: () {
                    setState(() {
                      _errorMessage = null;
                      _loadingProgress = 0;
                    });
                    _controller.loadRequest(_homeUri);
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }

  FutureOr<NavigationDecision> _handleNavigationRequest(
    NavigationRequest request,
  ) async {
    final uri = Uri.tryParse(request.url);
    if (uri == null) {
      return NavigationDecision.prevent;
    }

    if (_isPortfolioUrl(uri)) {
      return NavigationDecision.navigate;
    }

    await launchUrl(uri, mode: LaunchMode.externalApplication);
    return NavigationDecision.prevent;
  }

  bool _isPortfolioUrl(Uri uri) {
    return (uri.scheme == 'https' || uri.scheme == 'http') &&
        uri.host == _homeUri.host;
  }
}

class _LoadError extends StatelessWidget {
  const _LoadError({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return ColoredBox(
      color: Theme.of(context).colorScheme.surface,
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 360),
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text(
                  'Portfolio OS를 불러오지 못했습니다.',
                  style: Theme.of(context).textTheme.titleMedium,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                Text(
                  message,
                  style: Theme.of(context).textTheme.bodyMedium,
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 20),
                FilledButton(
                  onPressed: onRetry,
                  child: const Text('다시 시도'),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
