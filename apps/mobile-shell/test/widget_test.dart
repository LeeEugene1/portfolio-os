import 'package:flutter_test/flutter_test.dart';
import 'package:portfolio_os_mobile_shell/main.dart';

void main() {
  testWidgets('renders the shell placeholder', (tester) async {
    await tester.pumpWidget(const PortfolioOsShellApp());

    expect(find.text('Portfolio OS'), findsOneWidget);
  });
}
