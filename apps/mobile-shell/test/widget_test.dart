import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_os_mobile_shell/main.dart';

void main() {
  testWidgets('renders the WebView shell host', (tester) async {
    await tester.pumpWidget(
      PortfolioOsShellApp(
        webViewBuilder: (_) => const SizedBox(
          key: Key('portfolio-webview-placeholder'),
        ),
      ),
    );

    expect(find.byType(ShellHome), findsOneWidget);
    expect(
      find.byKey(const Key('portfolio-webview-placeholder')),
      findsOneWidget,
    );
  });
}
